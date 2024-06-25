const express = require("express");
const app = express();
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
app.use((req, res, next) => {
  if (!req.url.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    next();
  }
});
*/

// Iniciar servidor
const port = process.env.PORT || 4000;
app.locals.fechaInicio = new Date();

app.listen(port, () => {
  console.log(`sitio escuchando en el puerto ${port}`);
});

// Exportar la aplicación para testing
module.exports = app;
