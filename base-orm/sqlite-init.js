const db = require("aa-sqlite");

async function CrearBaseSiNoExiste() {
  // Abrir base de datos, crearla si no existe
  await db.open("./.data/TPI.db");

  let existe = false;
  let res = null;

  // Verificar si la tabla TipoEntrenador existe, si no existe, crearla
  existe = false;
  let sql =
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'TipoEntrenador'";
  res = await db.get(sql, []);
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      `CREATE TABLE TipoEntrenador( 
              id_tipoEntrenador INTEGER PRIMARY KEY AUTOINCREMENT,
              nombreTipoEntrenador TEXT NOT NULL 
            );`
    );
    console.log("Tabla TipoEntrenador creada!");
  }

  // Verificar si la tabla entrenadores existe, si no existe, crearla
  existe = false;
  sql =
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'entrenadores'";
  res = await db.get(sql, []);
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      `CREATE TABLE entrenadores( 
              id_Entrenador INTEGER PRIMARY KEY AUTOINCREMENT,
              nombreEntrenador TEXT NOT NULL UNIQUE,
              fechaNacimiento TEXT NOT NULL,
              añosExperiencia INTEGER NOT NULL,
              id_tipoEntrenador INTEGER,
              tieneClub BOOLEAN,
              clubActual TEXT,
              FOREIGN KEY (id_tipoEntrenador) REFERENCES TipoEntrenador(id_tipoEntrenador)
            );`
    );
    console.log("Tabla entrenadores creada!");
  }

  // Insertar tipos de entrenador si no existen
  await db.run(
    `INSERT OR IGNORE INTO TipoEntrenador (id_tipoEntrenador, nombreTipoEntrenador)
    VALUES
      (1, 'Director Técnico'),
      (2, 'Preparador Físico'),
      (3, 'Ayudante de Campo'),
      (4, 'Analista de Juego'),
      (5, 'Fisioterapeuta');`
  );

  // Insertar entrenadores
  await db.run(
    `INSERT INTO entrenadores (nombreEntrenador, fechaNacimiento, añosExperiencia, id_tipoEntrenador, tieneClub, clubActual)
    VALUES
      ('Diego Simeone', '1970-04-28', 15, 1, true, 'Atletico de Madrid'),
      ('Marcelo Bielsa', '1955-07-21', 25, 1, true, 'Leeds United'),
      ('Pep Guardiola', '1971-01-18', 20, 1, true, 'Manchester City'),
      ('Juan Carlos Osorio', '1961-06-08', 22, 2, true, 'Atletico Nacional'),
      ('Francisco Ayestaran', '1963-02-22', 18, 3, false, null),
      ('Jorge Desio', '1976-08-15', 12, 4, true, 'Real Madrid'),
      ('Carlos Velasco Carballo', '1971-03-17', 10, 5, false, null),
      ('Rafael Guerrero', '1980-09-12', 8, 2, true, 'Sevilla FC'),
      ('Pepe Conde', '1985-11-05', 5, 3, false, null),
      ('Marta López', '1990-07-30', 3, 5, false, null);`
  );

  // Cerrar la base de datos
  await db.close();
}

CrearBaseSiNoExiste();

module.exports = CrearBaseSiNoExiste;
