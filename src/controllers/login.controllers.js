import pool from "../database.js";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function setLogin(req, res, next) {
	try {
		const { logusuario, logcontrasena } = req.body;
		if (!logusuario || !logcontrasena) {
			return res.status(400).json({ error: "Complete los campos para entrar" });
		}

		const result = await pool.query("select validar_usuario(?, ?) as valid", [
			logusuario,
			logcontrasena,
		]);
		if (result && result[0] && result[0][0]) {
			const validationCode = result[0][0].valid;

			if (validationCode === 1) {
				console.log("Las credenciales son válidas");
				const token = jsonwebtoken.sign(
					{ user: logusuario },
					process.env.JWT_SECRET,
					{
						expiresIn: process.env.JWT_EXPIRATION,
					}
				);
				const cookieOption = {
					expires: new Date(
						Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
					),
					path: "/",
				};
				res.cookie("jwt", token, cookieOption); // Aquí se crea y establece la cookie
				return res.status(200).json({
					message: "Credenciales correctas",
					redirectTo: "/ventas",
				});
			} else if (validationCode === 0) {
				console.log("El usuario es incorrecto");
				return res.status(401).json({ error: "Usuario no encontrado" });
			} else if (validationCode === -1) {
				console.log("La contraseña es incorrecta");
				return res.status(401).json({ error: "Contraseña incorrecta" });
			}
		} else {
			console.log("Error al ejecutar la función confirmarCredenciales");
		}
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
}
