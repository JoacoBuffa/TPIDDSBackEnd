const express = require("express");

// crear servidor
const app = express();

require("./base-orm/sqlite-init"); // crear base si no existe

app.use(express.json()); // para poder leer json en el body

const cors = require("cors");
const path = require("path");
const sequelizeInit = require("./base-orm/sequelize-init"); // Inicialización de Sequelize
const sqliteInit = require("./base-orm/sqlite-init"); // Inicialización de SQLite

// Middleware
app.use(express.json()); // Para parsear JSON en el body de las peticiones
app.use(cors()); // Habilitar CORS para todas las rutas

// Rutas

const tipoEntrenadorRouter = require("./routes/tipoEntrenador"); // Ruta para TipoEntrenador
const entrenadoresRouter = require("./routes/entrenadores"); // Ruta para entrenadores

const clubesRouter = require("./routes/clubes");
const ciudadesRouter = require("./routes/ciudades");

// Ruta de inicio
app.get("/", (req, res) => {
  res.send("dds-backend iniciado!");
});

// Middleware para manejar las rutas específicas
app.use("/api/tipoEntrenador", tipoEntrenadorRouter); // Usar la ruta de TipoEntrenador
app.use("/api/entrenadores", entrenadoresRouter); // Usar la ruta de entrenadores

app.use(clubesRouter);
app.use(ciudadesRouter);

// Middleware para manejar archivos estáticos (si es necesario)
/*
app.use(express.static('public'));
const path = require('path'); // Include path module
app.use((req, res, next) => {
  if (!req.url.startsWith('/api')) {
    // Manejar la solicitud
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    // Pasar la solicitud al siguiente middleware
    next();
  }
});
*/

// controlar ruta
app.get("/", (req, res) => {
  res.send("dds-backend iniciado!");
});

const tipoEntrenadorRouter = require("./routes/tipoEntrenador");
app.use(tipoEntrenadorRouter);

const entrenadoresRouter = require("./routes/entrenadores");
app.use(entrenadoresRouter);

// levantar servidor
if (!module.parent) {
  // si no es llamado por otro módulo, es decir, si es el módulo principal -> levantamos el servidor
  const port = process.env.PORT || 3000; // en producción se usa el puerto de la variable de entorno PORT
  app.locals.fechaInicio = new Date();
  app.listen(port, () => {
    console.log(`sitio escuchando en el puerto ${port}`);
  });
}
module.exports = app; // para testing
