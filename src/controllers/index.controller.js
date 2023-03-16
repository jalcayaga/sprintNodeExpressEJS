import config from "../config.js";
import fs from "fs";
const path = "src/json/resultados.json";

// cargando JSON
const json_resultados = fs.readFileSync("src/resultados.json", "utf-8");
let resultados = JSON.parse(json_resultados);

const json_equipos = fs.readFileSync("src/json/equipos.json", "utf-8");
let equipos = JSON.parse(json_equipos);

const json_carreras = fs.readFileSync("src/json/carreras.json", "utf-8");
let carreras = JSON.parse(json_carreras);

const json_puntajes = fs.readFileSync("src/json/puntajes.json", "utf-8");
let puntajes = JSON.parse(json_puntajes);

const json_ranking = fs.readFileSync("src/json/ranking.json", "utf-8");
let ranking = JSON.parse(json_ranking);

/* ------------------- Funciones para reportes 1 ------------------- */
const calcularPuntajes = (resultados) => {
  let puntajes = {};

  resultados.forEach((resultado) => {
    resultado.carreras.forEach((carrera) => {
      if (!puntajes[resultado.escuderia]) {
        puntajes[resultado.escuderia] = 0;
      }
      puntajes[resultado.escuderia] += carrera.puntaje;
    });
  });

  return puntajes;
};
/* ------------------------ Funcion para reportes total abandonos ----------------------- */
const calcularAbandonos = (resultados) => {
  let abandonos = {};

  resultados.forEach((resultado) => {
    let piloto = resultado.idPiloto;
    let abandonosPiloto = resultado.carreras.filter(
      (carrera) => carrera.tecnicos || carrera.personales
    ).length;

    abandonos[piloto] = abandonosPiloto;
  });

  return abandonos;
};
/* ------------------- funcion para reportes total tiempos ------------------ */
const calcularTiemposTotalesPilotos = (resultados) => {
  let tiempos = {};

  resultados.forEach((resultado) => {
    let piloto = resultado.idPiloto;
    console.log(`Procesando piloto: ${piloto}`); // Agregar esta línea
    let tiempoTotalPiloto = resultado.carreras.reduce((total, carrera) => {
      console.log(`Procesando carrera: ${JSON.stringify(carrera)}`); // Agregar esta línea
      return total + convertirTiempoASegundos(carrera.tiempo);
    }, 0);
    tiempos[piloto] = tiempoTotalPiloto;
  });

  return tiempos;
};

const convertirTiempoASegundos = (tiempo) => {
  console.log(`Tiempo recibido: ${tiempo}`); // Agregar esta línea

  if (!tiempo || typeof tiempo !== 'string') {
    return 0;
  }

  const partes = tiempo.split(':');

  if (partes.length !== 3) {
    return 0;
  }

  const [horas, minutos, segundos] = partes.map(Number);
  const totalSegundos = horas * 3600 + minutos * 60 + segundos;
  console.log(`Tiempo: ${tiempo}, Segundos: ${totalSegundos}`);
  return totalSegundos;
};

// render de rutas
export const renderIndexPage = (req, res) => res.render("index", { resultados, equipos, carreras });

/* ----------------------------- pagina reportes ---------------------------- */
export const renderReportesPage = (req, res) => {
  let puntajes = calcularPuntajes(resultados);
  let ranking = Object.entries(puntajes)
    .sort((a, b) => b[1] - a[1])
    .map((entry, index) => ({
      escuderia: entry[0],
      puntos: entry[1],
      posicion: index + 1,
    }));
  let abandonos = calcularAbandonos(resultados);
  let tiemposTotalesPilotos = calcularTiemposTotalesPilotos(resultados);

  // Convierte el objeto tiemposTotalesPilotos en un array y ordena de mayor a menor tiempo
  let tiemposTotalesPilotosArray = Object.entries(tiemposTotalesPilotos).sort(
    (a, b) => b[1] - a[1]
  );

  // Asigna una posición en el ranking a cada piloto
  tiemposTotalesPilotosArray = tiemposTotalesPilotosArray.map((entry, index) => ({
    idPiloto: entry[0],
    tiempoTotal: entry[1],
    posicion: index + 1,
  }));

  res.render("reportes", {
    config,
    resultados,
    ranking,
    abandonos,
    tiemposTotalesPilotos: tiemposTotalesPilotosArray,
  });
};

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
  let { idPiloto, circuito, tiempo, posicion, tecnicos, personales } =
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

  //condiciones desde el backend para no continuar
  if (!idPiloto || !tiempo || !posicion) {
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
  //buscamos el piloto por idPiloto y le insertamos claves y valores
  let piloto = resultados.find((piloto) => piloto.idPiloto == idPiloto);

  if (piloto) {
    let carrera = {
      circuito,
      tiempo,
      posicion,
      puntaje: null,
      tecnicos,
      personales,
    };
    // Buscar el equipo del piloto
    let equipoPiloto = equipos.find((equipo) => equipo.idPiloto == idPiloto);

    if (equipoPiloto) {
      nombre = equipoPiloto.nombre;
      escuderia = equipoPiloto.escuderia;
    } else {
      console.log(`No se encontró el equipo del piloto con id ${idPiloto}`);
    }

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

    //si no encuentra al piloto lo crea en esta parte
  } else {

     // Buscar el equipo del piloto
     let equipoPiloto = equipos.find((equipo) => equipo.idPiloto == idPiloto);

     if (equipoPiloto) {
       nombre = equipoPiloto.nombre;
       escuderia = equipoPiloto.escuderia;
     } else {
       console.log(`No se encontró el equipo del piloto con id ${idPiloto}`);
     }
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
      tiempo,
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

  // Ordena los resultados por total de puntos descendente
  resultados.sort((a, b) => {
    const totalPuntosA = a.carreras.reduce((total, carrera) => total + carrera.puntaje, 0);
    const totalPuntosB = b.carreras.reduce((total, carrera) => total + carrera.puntaje, 0);

    return totalPuntosB - totalPuntosA;
  });

  // guarda el array en un json
  let json_resultados = JSON.stringify(resultados);
  fs.writeFileSync("src/resultados.json", json_resultados, "utf-8");
  res.redirect("/");
};
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
/* ------------------------------ crear reportes ----------------------------- */
export const crearReportes = (req, res) => {
  let puntajesEscuderias = {};

  for (let i = 0; i < resultados.length; i++) {
    let escuderia = resultados[i].escuderia;
    let puntajeCarrera = resultados[i].carreras.reduce(
      (total, carrera) => total + carrera.puntaje,
      0
    );

    if (!puntajesEscuderias.hasOwnProperty(escuderia)) {
      puntajesEscuderias[escuderia] = 0;
    }

    puntajesEscuderias[escuderia] += puntajeCarrera;
  }

  // Convierte el objeto de puntajes en un array y ordenalo en orden descendente
  let puntajesOrdenados = Object.entries(puntajesEscuderias).sort(
    (a, b) => b[1] - a[1]
  );

  // Asigna un rango a cada escudería
  for (let i = 0; i < puntajesOrdenados.length; i++) {
    puntajesOrdenados[i][1] = i + 1;
  }

  // Agrega la clasificación a cada objeto de resultado
  for (let i = 0; i < resultados.length; i++) {
    let escuderia = resultados[i].escuderia;
    resultados[i].totales = puntajesEscuderias[escuderia];
    resultados[i].ranking = puntajesOrdenados.find(
      (item) => item[0] === escuderia
    )[1];
  }
};