// src/routes/newLogin.routes.js
import { Router } from 'express';
import * as usuario from '../controllers/usuario.controllers.js';

const router = Router();

// Ruta para login
router.post('/new-login', usuario.setNewLogin);

// Ruta para registrar un nuevo usuario
router.post('/register', usuario.registerUser);

export default router;
