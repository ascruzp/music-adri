import express from "express";
import morgan from "morgan";
import ventasRoutes from "./routes/ventas.routes.js";
import inventarioRoutes from "./routes/inventario.routes.js";
import usuario from "./routes/usuario.routes.js";
import loginRoutes from "./routes/login.routes.js";
import cookieParser from "cookie-parser";
import * as authorization from "./middlewares/authorization.js";
import cors from "cors";

//Intialization
const app = express();

//Settings
app.set("port", process.env.PORT || 4000);
app.use(cors());
//Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Routes
app.get("/", authorization.soloPublico, (req, res) => {
	res.render("xdd");
});

app.use(cookieParser());
app.use(loginRoutes);
app.use(ventasRoutes);
app.use(inventarioRoutes);
app.use(usuario); // Agrega las nuevas rutas de login

//Run Server
app.listen(app.get("port"), () =>
	console.log("Server listening on port", app.get("port"))
);
