import { Router } from "express";

import {
  renderIndexPage,
  renderReportesPage,
  renderNuevoResultadoPage,
  editarNuevoResultado,
  borrarResultado,
  crearReportes,
} from "../controllers/index.controller.js";

const router = Router();

// Ruta para actualizar un resultado existente
router.post("/nuevo-resultado/", editarNuevoResultado);
// Ruta para mostrar la página principal
router.get("/", renderIndexPage);

// Ruta para mostrar la página de reportes
router.get("/reportes", renderReportesPage, crearReportes);

// Ruta para mostrar la página de creación de resultados
router.get("/nuevo-resultado/", renderNuevoResultadoPage);

// Ruta para eliminar un resultado existente
router.get("/borrar/:idPiloto", borrarResultado);

export default router;
