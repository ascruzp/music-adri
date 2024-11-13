import { Router } from "express";
import * as inventarioControllers from "../controllers/inventario.controllers.js";
const router = Router();

router
	.get(
		"/inventario/detallesInventario",
		inventarioControllers.getDetallesProductos
	)
	.get("/inventario/buscarMarca", inventarioControllers.getBuscarMarca)
	.get(
		"/inventario/buscarCategoria",
		inventarioControllers.getBuscarCategoria
	)
	.put("/inventario/editarProducto", inventarioControllers.editarProducto)
	.post("/inventario/insertarProducto", inventarioControllers.insertarProducto);

export default router;
