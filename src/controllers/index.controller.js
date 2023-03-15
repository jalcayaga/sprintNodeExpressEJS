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
export const renderIndexPage = (req, res) => res.render("index", { resultados, equipos });
/* ----------------------------- pagina reportes ---------------------------- */
export const renderReportesPage = (req, res) => res.render("reportes", config);

export const renderEditarNuevoResultado = (req, res) => {
  const idPiloto = req.params.idPiloto;
  const piloto = resultados.find((p) => p.idPiloto === idPiloto);
  res.render("nuevo-resultado", { piloto, resultados, equipos, carreras, puntajes });
};


export const renderNuevoResultadoPage = (req, res) => res.render("nuevo-resultado", { resultados, equipos, carreras, puntajes});
/* ---------------------------- // Funciones CRUD --------------------------- */ 




/* --------------- // editar objeto dentro de resultados.json --------------- */
export const editarNuevoResultado = (req, res) => {
const {id} = req.params
const {name, salary} = req.body
console.log(id, name, salary)
res.json('received') 



  // console.log(idPiloto);
  // console.log(req.body);  
  // const { circuito, minutos, posicion, tecnicos, personales } = req.body;
  // const { idCarrera, nombre } = req.body;
  // const idPiloto = req.params.idPiloto; // obtener el id del piloto de los parámetros de la URL
  // console.log(idPiloto); 
  // if (!idPiloto || !circuito || !minutos || !posicion || !tecnicos ) {
  //   res.status(400).send("Estas intentando editar mal");
  //   return;
  // }
  // muestra el id del piloto en la consola
  // resto del código de la función editarNuevoResultado
};

export const crearNuevoResultado = (req, res) => {
  const { escuderia, nombre, circuito, minutos, posicion, tecnicos, personales } = req.body;

  if (!escuderia || !nombre || !circuito || !minutos || !posicion ) {
    res.status(400).send("Ingresar piloto, minutos, posicion y si abandono.");
    return;
  }
  const idPiloto = resultados.findIndex(r => r.id === parseInt(req.params.idPiloto));

  let nuevoResultado = {
    id: idPiloto,
    escuderia,
    nombre,
    carrera:[{
      circuito,
      minutos,
      posicion,
      tecnicos,
      personales,
    }]
  };

  // añadir nuevo resultado al array
  resultados.push(nuevoResultado);

  // guarda el array en un json
  const json_resultados = JSON.stringify(resultados);
  fs.writeFileSync("src/resultados.json", json_resultados, "utf-8");

  res.redirect("/");
};
/* ------------------ // borrar objeto del resultados.json ------------------ */
export const borrarResultado = (req, res) => {
  console.log({ resultados });
  resultados = resultados.filter((resultado) => resultado.idPiloto != req.params.idPiloto);

  // saving data
  const json_resultados = JSON.stringify(resultados);
  fs.writeFileSync("src/resultados.json", json_resultados);
  res.redirect("/");
};


