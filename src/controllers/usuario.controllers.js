import pool from '../database.js';  // Importa el pool de conexiones

export const setNewLogin = async (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    }

    try {
        // Consulta para buscar al usuario en la base de datos
        const query = 'SELECT * FROM cliente WHERE usuario_cliente = ?';
        const [results] = await pool.query(query, [usuario]); // Utiliza el pool para ejecutar la consulta

        if (results.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const user = results[0];

        // Comparar la contraseña sin cifrado
        if (password !== user.password_cliente) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Login exitoso
        res.status(200).json({ message: 'Login exitoso', userId: user.id_cliente });
    } catch (error) {
        console.error('Error al iniciar sesión:', error); // Agregar un log del error
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


export const registerUser = async (req, res) => {
    const { usuario_cliente, password_cliente } = req.body;
  
    try {
      // Validación básica
      if (!usuario_cliente || !password_cliente) {
        return res.status(400).json({ message: 'El nombre de usuario y la contraseña son requeridos.' });
      }
  
      // Comprobar si el usuario ya existe
      const [existingUser] = await pool.query('SELECT * FROM cliente WHERE usuario_cliente = ?', [usuario_cliente]);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
      }
  
      // Insertar el nuevo usuario en la base de datos
      const [result] = await pool.query(
        'INSERT INTO cliente (usuario_cliente, password_cliente) VALUES (?, ?)',
        [usuario_cliente, password_cliente] // Almacena la contraseña sin encriptar
      );
  
      res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al registrar el usuario.' });
    }
  };
  

