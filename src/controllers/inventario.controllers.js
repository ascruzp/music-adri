import pool from "../database.js";

export async function getDetallesProductos(req, res) {
	try {
		const [result] = await pool.query(`SELECT * FROM VistaInventario`);

		if (result.length === 0) {
			return res
				.status(404)
				.json({ message: "No se encontraron productos." });
		}

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function editarProducto(req, res) {
	const {
		id_producto,
		nombre_producto,
		precio_unitario,
		stock_disponible,
		stock_alerta,
		estado_producto,
		url_producto,
		id_categoria,
		descripcion_producto,
		id_marca,
	} = req.body;

	if (
		!id_producto ||
		!nombre_producto ||
		!precio_unitario ||
		!stock_disponible ||
		!stock_alerta ||
		!url_producto ||
		!estado_producto ||
		!id_categoria ||
		!descripcion_producto ||
		!id_marca
	) {
		return res
			.status(400)
			.json({ message: "Todos los campos son obligatorios." });
	}

	try {
		const [result] = await pool.query(
			`CALL EditarProducto(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				id_producto,
				nombre_producto,
				precio_unitario,
				stock_disponible,
				stock_alerta,
				estado_producto,
				id_categoria,
				id_marca,
				url_producto,
				descripcion_producto,
			]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Producto no encontrado." });
		}

		res.status(200).json({ message: "Producto actualizado exitosamente." });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function insertarProducto(req, res) {
	const {
		nombre_producto,
		precio_unitario,
		stock_disponible,
		stock_alerta,
		estado_producto,
		id_categoria,
		id_marca,
		descripcion_producto,
		url_producto
	} = req.body;

	if (
		!nombre_producto ||
		!precio_unitario ||
		!stock_disponible ||
		!stock_alerta ||
		!estado_producto ||
		!id_categoria ||
		!id_marca ||
		!descripcion_producto ||
		!url_producto
	) {
		return res
			.status(400)
			.json({ message: "Todos los campos son obligatorios." });
	}

	try {
		const [insertResult] = await pool.query(
			`CALL InsertarProducto(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				nombre_producto,
				precio_unitario,
				stock_disponible,
				stock_alerta,
				estado_producto,
				id_categoria,
				id_marca,
				1,
				descripcion_producto,
				url_producto,
			]
		);

		const id_producto = insertResult[0][0].id_producto;

		const [producto] = await pool.query(
			`SELECT * FROM producto WHERE id_producto = ?`,
			[id_producto]
		);

		res.json(producto[0]);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function getBuscarMarca(req, res) {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = 5;
		const offset = (page - 1) * pageSize;
		const searchTerm = req.query.search || "";

		const searchQuery = `
            SELECT id_marca, nombre_marca
            FROM marca
            WHERE nombre_marca LIKE ?
            LIMIT ? OFFSET ?
        `;
		const [marcasEncontradas] = await pool.query(searchQuery, [
			`%${searchTerm}%`,
			pageSize,
			offset,
		]);

		const countQuery = `
            SELECT COUNT(*) AS total 
            FROM marca
            WHERE nombre_marca LIKE ?
        `;
		const [totalMarcas] = await pool.query(countQuery, [`%${searchTerm}%`]);
		const total = totalMarcas[0].total;
		const totalPages = Math.ceil(total / pageSize);

		const response = {
			count: marcasEncontradas.length,
			total: total,
			totalPages: totalPages,
			currentPage: page,
			next:
				page < totalPages
					? `/inventario/buscarMarca?search=${searchTerm}&page=${
							Number(page) + 1
					  }`
					: null,
			previous:
				page > 1
					? `/inventario/buscarMarca?search=${searchTerm}&page=${
							Number(page) - 1
					  }`
					: null,
			results: marcasEncontradas.map((marca) => ({
				id_marca: marca.id_marca,
				nombre_marca: marca.nombre_marca,
			})),
		};

		res.json(response);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function getBuscarCategoria(req, res) {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = 5;
		const offset = (page - 1) * pageSize;
		const searchTerm = req.query.search || "";

		const searchQuery = `
            SELECT id_categoria, nombre_categoria
            FROM categoria
            WHERE nombre_categoria LIKE ?
            LIMIT ? OFFSET ?
        `;
		const [categoriasEncontradas] = await pool.query(searchQuery, [
			`%${searchTerm}%`,
			pageSize,
			offset,
		]);

		const countQuery = `
            SELECT COUNT(*) AS total 
            FROM categoria
            WHERE nombre_categoria LIKE ?
        `;
		const [totalCategorias] = await pool.query(countQuery, [
			`%${searchTerm}%`,
		]);
		const total = totalCategorias[0].total;
		const totalPages = Math.ceil(total / pageSize);

		const response = {
			count: categoriasEncontradas.length,
			total: total,
			totalPages: totalPages,
			currentPage: page,
			next:
				page < totalPages
					? `/inventario/buscarCategoria?search=${searchTerm}&page=${
							Number(page) + 1
					  }`
					: null,
			previous:
				page > 1
					? `/inventario/buscarCategoria?search=${searchTerm}&page=${
							Number(page) - 1
					  }`
					: null,
			results: categoriasEncontradas.map((categoria) => ({
				id_categoria: categoria.id_categoria,
				nombre_categoria: categoria.nombre_categoria,
			})),
		};

		res.json(response);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}
