import { Router } from "express";
import * as loginControllers from "../controllers/login.controllers.js";
const router = Router();

router.post("/login", loginControllers.setLogin);
export default router;
