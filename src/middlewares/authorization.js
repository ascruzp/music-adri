import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function soloAdmin(req, res, next) {
	try {
		const logueado = await revisarCookie(req, res);
		if (logueado) {
			return next();
		}
		return res.redirect("/");
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

export async function soloPublico(req, res, next) {
	try {
		const logueado = await revisarCookie(req, res);
		if (!logueado) {
			return next();
		}
		return res.redirect("/ventas");
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

async function revisarCookie(req, res) {
	try {
		const cookieJWT = req.headers.cookie
			?.split("; ")
			.find((cookie) => cookie.startsWith("jwt="))
			?.substring(4);
		const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
		console.log(decodificada);
		if (!cookieJWT) {
			return false;
		}
		return true;
	} catch (err) {
		console.error("Error al revisar la cookie:", err.message);
		return false;
	}
}
