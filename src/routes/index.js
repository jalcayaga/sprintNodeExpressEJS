import { Router } from "express";

import {
  renderIndexPage,
  renderReportesPage,
  renderNuevoResultadoPage,
  crearNuevoResultado,
  editarNuevoResultado,
  borrarResultado,
} from "../controllers/index.controller.js";

const router = Router();
// Ruta para mostrar la página principal
router.get("/", renderIndexPage);

// Ruta para mostrar la página de reportes
router.get("/reportes", renderReportesPage);

// Ruta para mostrar la página de creación de resultados
router.get("/nuevo-resultado", renderNuevoResultadoPage);

// Ruta para crear un nuevo resultado
router.post("/nuevo-resultado", crearNuevoResultado);

// Ruta para actualizar un resultado existente
router.patch("/nuevo-resultado/:idPiloto", editarNuevoResultado);

// Ruta para eliminar un resultado existente
router.get("/borrar/:idPiloto", borrarResultado);

export default router;
