import { Router } from "express";

import {
  renderIndexPage,
  renderReportesPage,
  renderNuevoResultadoPage,
  crearNuevoResultado,
  borrarResultado,
} from "../controllers/index.controller.js";

const router = Router();

router.get("/", renderIndexPage);

router.get("/reportes", renderReportesPage);

router.get("/nuevo-resultado", renderNuevoResultadoPage);

router.post("/nuevo-resultado", crearNuevoResultado);

router.get("/borrar/:id", borrarResultado);

export default router;
