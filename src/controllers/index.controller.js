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
  res.render("index", { resultados, equipos });
/* ----------------------------- pagina reportes ---------------------------- */
export const renderReportesPage = (req, res) => res.render("reportes", config);

export const renderEditarNuevoResultado = (req, res) => {
  const idPiloto = req.body.idPiloto;
  const equipo = equipos.find((equipo) => equipo.idPiloto === idPiloto);
  
 
  if (equipo) {
    escuderia = equipo.escuderia;
    piloto = equipo.piloto;
  }
  
  console.log('equipos:', equipos);
  console.log('carreras:', carreras);
  console.log('puntajes:', puntajes);

  res.render('nuevo-resultado', { equipos, carreras, puntajes, escuderia: 'Ferrari', piloto: 'Carlos Sainz' });

};

export const renderNuevoResultadoPage = (req, res) =>
  res.render("nuevo-resultado", { resultados, equipos, carreras, puntajes });
/* ---------------------------- // Funciones CRUD --------------------------- */

/* --------------- // Editar o Crear objeto dentro de resultados.json --------------- */
export const editarNuevoResultado = (req, res) => {
  // Leer archivo de resultados
  const json_resultados = fs.readFileSync("src/resultados.json", "utf-8");
  let resultados = JSON.parse(json_resultados);
  // Leer archivo de puntajes
  const json_puntajes = fs.readFileSync("src/json/puntajes.json", "utf-8");
  const puntajes = JSON.parse(json_puntajes);

  console.log(req.body);
  let {
    idPiloto,
    escuderia,
    nombre,
    circuito,
    minutos,
    posicion,
    tecnicos,
    personales,
  } = req.body;

  if (!idPiloto || !circuito || !posicion) {
    res.status(400).send("Faltan datos obligatorios");
    return;
  }

  if (!Array.isArray(resultados)) {
    res.status(500).send("resultados no es un arreglo");
    return;
  }

  let piloto = resultados.find((piloto) => piloto.idPiloto === idPiloto);

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
    let puntaje = puntajes.find((p) => p.posicion === posicion);

    if (puntaje) {
      carrera.puntaje = puntaje.valor;
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
      escuderia,
      nombre,
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
     const puntaje = puntajes.find((puntaje) => puntaje.posicion === posicion);
     if (puntaje) {
       carrera.puntaje = puntaje.puntaje;
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
