import { Router } from "express";
import * as ventasControllers from "../controllers/ventas.controllers.js";
const router = Router();

router
	// Obtener ultimo numero boleta
	.get("/ventas/ultimoNumeroBoleta", ventasControllers.getUltimoNumeroBoleta)
	// Buscar productos
	.get("/ventas/buscarProducto", ventasControllers.getBuscarProducto)
	// Mostrar metodos de pago
	.get("/ventas/metodosPago", ventasControllers.getMetodoPagoProducto)
	.get("/ventas/verBoletaGeneral", ventasControllers.getMostrarBoletaGeneral)
	.get("/ventas/verBoletaProductos", ventasControllers.getMostrarBoletaProductos)
	.post("/ventas/subirVenta", ventasControllers.setSubirVenta);

export default router;
