import config from "../config.js";
import fs from "fs";
import { v4 } from "uuid";

// cargando JSON
const json_resultados = fs.readFileSync("src/resultados.json", "utf-8");
let resultados = JSON.parse(json_resultados);

const json_equipos = fs.readFileSync("src/json/equipos.json", "utf-8");
let equipos = JSON.parse(json_equipos);

const json_carreras = fs.readFileSync("src/json/carreras.json", "utf-8");
let carreras = JSON.parse(json_carreras);

// render de rutas
export const renderIndexPage = (req, res) => res.render("index", { resultados, equipos });

export const renderReportesPage = (req, res) => res.render("reportes", config);

export const renderNuevoResultadoPage = (req, res) => res.render("nuevo-resultado", { carreras, equipos });

export const crearNuevoResultado = (req, res) => {
  const { escuderia, piloto1, piloto2, circuito, minutos, posicion, abandono } = req.body;

  if (!escuderia || !piloto1 ||  !piloto2 || !circuito || !minutos || !posicion) {
    res.status(400).send("Ingresar piloto, minutos, posicion y si abandono.");
    return;
  }


  var nuevoResultado = {
    id: v4(),
    escuderia,
    piloto1,
    piloto2,
    circuito,
    minutos,
    posicion,
    abandono,
  };

  // añadir nuevo resultado al array
  resultados.push(nuevoResultado);

  // guarda el array en un json
  const json_resultados = JSON.stringify(resultados);
  fs.writeFileSync("src/resultados.json", json_resultados, "utf-8");

  res.redirect("/");
};

export const borrarResultado = (req, res) => {
  console.log({ resultados });
  resultados = resultados.filter((resultado) => resultado.id != req.params.id);

  // saving data
  const json_resultados = JSON.stringify(resultados);
  fs.writeFileSync("src/resultados.json", json_resultados);
  res.redirect("/");
};
