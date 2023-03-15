import config from "../config.js";
import fs from "fs";

// cargando JSON
const json_resultados = fs.readFileSync("src/resultados.json", "utf-8");
let resultados = JSON.parse(json_resultados);

const json_equipos = fs.readFileSync("src/json/equipos.json", "utf-8");
let equipos = JSON.parse(json_equipos);

const json_carreras = fs.readFileSync("src/json/carreras.json", "utf-8");
let carreras = JSON.parse(json_carreras);

const json_puntajes = fs.readFileSync("src/json/puntajes.json", "utf-8");
let puntajes = JSON.parse(json_puntajes);

// render de rutas
export const renderIndexPage = (req, res) =>
  res.render("index", { resultados, equipos, carreras });
/* ----------------------------- pagina reportes ---------------------------- */
export const renderReportesPage = (req, res) => res.render("reportes", config);

export const renderEditarNuevoResultado = (req, res) => {
  res.render("nuevo-resultado", {
    equipos,
    carreras,
    puntajes,
    resultados,
  });
};

export const renderNuevoResultadoPage = (req, res) =>
  res.render("nuevo-resultado", { resultados, equipos, carreras, puntajes });
/* ---------------------------- // Funciones CRUD --------------------------- */

/* --------------- // Editar o Crear objeto dentro de resultados.json --------------- */
export const editarNuevoResultado = (req, res) => {
  let { idPiloto, circuito, minutos, posicion, tecnicos, personales } =
    req.body;
  // Leer archivo de resultados
  const json_resultados = fs.readFileSync("src/resultados.json", "utf-8");
  let resultados = JSON.parse(json_resultados);

  // Leer archivo de puntajes
  const json_puntajes_path = "src/json/puntajes.json";
  const json_puntajes = fs.readFileSync(json_puntajes_path, "utf-8");
  if (!json_puntajes) {
    console.log(`No se pudo leer el archivo ${json_puntajes_path}`);
    return;
  }
  let puntajes = JSON.parse(json_puntajes);
  // Leer archivo de equipos
  const json_equipos_path = "src/json/equipos.json";
  const json_equipos = fs.readFileSync(json_equipos_path, "utf-8");
  if (!json_equipos) {
    console.log(`No se pudo leer el archivo ${json_equipos_path}`);
    return;
  }
  let equipos = JSON.parse(json_equipos);

  /* --------------------------- algunos console.log -------------------------- */
  console.log(equipos);
  console.log(typeof puntajes); // "object"
  console.log(puntajes);
  console.log(req.body);

  // Convertir a booleanos
  tecnicos = tecnicos ? true : false;
  personales = personales ? true : false;

  if (!idPiloto || !minutos || !posicion) {
    res.status(400).send("Faltan datos obligatorios");
    return;
  }

  if (!Array.isArray(resultados)) {
    res.status(500).send("resultados no es un arreglo");
    return;
  }

  /* ---------------------- Variables nombre y escuderia ---------------------- */
  let nombre = "";
  let escuderia = "";

  // Buscar el equipo del piloto
  let equipoPiloto = equipos.find((equipo) => equipo.idPiloto == idPiloto);

  if (equipoPiloto) {
    nombre = equipoPiloto.nombre;
    escuderia = equipoPiloto.escuderia;
  } else {
    console.log(`No se encontró el equipo del piloto con id ${idPiloto}`);
  }

  let piloto = resultados.find((piloto) => piloto.idPiloto == idPiloto);

  if (piloto) {
    let carrera = {
      circuito,
      minutos,
      posicion,
      puntaje: null,
      tecnicos,
      personales,
    };

    // Buscar puntaje correspondiente a la posición
    let puntaje = puntajes.find((puntaje) => puntaje.posicion == posicion);

    if (puntaje) {
      carrera.puntaje =
        puntaje.valor !== undefined ? puntaje.valor : puntaje.puntaje;
    } else {
      console.log(`No se encontró el puntaje para la posición ${posicion}`);
    }

    if (!Array.isArray(piloto.carreras)) {
      piloto.carreras = [];
    }

    piloto.carreras.push(carrera);

    let json_resultados = JSON.stringify(resultados);
    fs.writeFileSync("src/resultados.json", json_resultados, "utf-8");

    res.redirect("/");
  } else {
    // Si no se encuentra el piloto, crear uno nuevo
    piloto = {
      idPiloto,
      nombre,
      escuderia,
      carreras: [],
    };
    resultados.push(piloto);

    let carrera = {
      circuito,
      minutos,
      posicion,
      puntaje: null,
      tecnicos,
      personales,
    };

    // Buscar puntaje correspondiente a la posición
    const puntaje = puntajes.find((puntaje) => puntaje.posicion == posicion);
    if (puntaje) {
      carrera.puntaje =
        puntaje.valor !== undefined ? puntaje.valor : puntaje.puntaje;
    } else {
      console.log(`No se encontró el puntaje para la posición ${posicion}`);
    }
    piloto.carreras.push(carrera);

    // guarda el array en un json
    let json_resultados = JSON.stringify(resultados);
    fs.writeFileSync("src/resultados.json", json_resultados, "utf-8");
    res.redirect("/");
  }
};
/* ------------------ // borrar objeto del resultados.json ------------------ */
export const borrarResultado = (req, res) => {
  console.log({ resultados });
  resultados = resultados.filter(
    (resultado) => resultado.idPiloto != req.params.idPiloto
  );

  // saving data
  const json_resultados = JSON.stringify(resultados);
  fs.writeFileSync("src/resultados.json", json_resultados);
  res.redirect("/");
};
