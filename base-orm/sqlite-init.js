const db = require("aa-sqlite");

async function CrearBaseSiNoExiste() {
  // Abrir base de datos, crearla si no existe
  await db.open("./.data/TPI.db");

  let existe = false;
  let res = null;

  // Verificar si la tabla TipoEntrenador existe, si no existe, crearla
  existe = false;
  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'TipoEntrenador'",
    []
  );
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      `CREATE TABLE TipoEntrenador( 
              id_tipoEntrenador INTEGER PRIMARY KEY AUTOINCREMENT,
              nombreTipoEntrenador TEXT NOT NULL 
            );`
    );
    console.log("Tabla TipoEntrenador creada!");

    await db.run(
      `INSERT OR IGNORE INTO TipoEntrenador (id_tipoEntrenador, nombreTipoEntrenador)
      VALUES
        (1, 'Director Técnico'),
        (2, 'Preparador Físico'),
        (3, 'Ayudante de Campo'),
        (4, 'Analista de Juego'),
        (5, 'Fisioterapeuta');`
    );
  }

  // Verificar si la tabla entrenadores existe, si no existe, crearla
  existe = false;
  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'entrenadores'",
    []
  );
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
              Activo boolean,
              FOREIGN KEY (id_tipoEntrenador) REFERENCES TipoEntrenador(id_tipoEntrenador)
            );`
    );
    console.log("Tabla entrenadores creada!");
    // Insertar entrenadores
    await db.run(
      `INSERT INTO entrenadores (nombreEntrenador, fechaNacimiento, añosExperiencia, id_tipoEntrenador, tieneClub, clubActual)
    VALUES
      ('Diego Simeone', '1970-04-28', 15, 1, true, 'Atletico de Madrid',1),
      ('Marcelo Bielsa', '1955-07-21', 25, 1, true, 'Leeds United',1),
      ('Pep Guardiola', '1971-01-18', 20, 1, true, 'Manchester City',1),
      ('Juan Carlos Osorio', '1961-06-08', 22, 2, true, 'Atletico Nacional',1),
      ('Francisco Ayestaran', '1963-02-22', 18, 3, false, 'Barcelona',1),
      ('Jorge Desio', '1976-08-15', 12, 4, true, 'Real Madrid',1),
      ('Carlos Velasco Carballo', '1971-03-17', 10, 5, false, 'Racing',1),
      ('Rafael Guerrero', '1980-09-12', 8, 2, true, 'Sevilla FC',1),
      ('Pepe Conde', '1985-11-05', 5, 3, false, 'Talleres',1),
      ('Marta López', '1990-07-30', 3, 5, false, 'Independiente',1);`
    );
  }

  // CIUDADES

  existe = false;
  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'ciudades'",
    []
  );
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      "CREATE table ciudades( idCiudad INTEGER PRIMARY KEY AUTOINCREMENT, nombreCiudad text NOT NULL UNIQUE);"
    );
    console.log("tabla articulosfamilias creada!");
    await db.run(
      `insert into ciudades values
      (1, 'Buenos Aires'),
      (2, 'Madrid'),
      (3, 'Barcelona'),
      (4, 'Turin'),
      (5, 'Manchester'),
      (6, 'Munich'),
      (7, 'Paris'),
      (8, 'Rio de Janeiro'),
      (9, 'Londres'),
      (10, 'Montevideo')
      ;`
    );
  }

  // CLUBES

  existe = false;
  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'clubes'",
    []
  );
  if (res.contar > 0) existe = true;

  if (!existe) {
    await db.run(
      `CREATE table clubes( 
              idClub INTEGER PRIMARY KEY AUTOINCREMENT
            , nombreClub text NOT NULL UNIQUE
            , fechaCreacion text
            , torneosGanados integer
            , activo boolean
            , idCiudad integer
            , FOREIGN KEY (idCiudad) REFERENCES ciudades(idCiudad)
            );`
    );
    console.log("tabla clubes creada!");

    await db.run(
      `insert into clubes values
      (1, 'Club Atlético Boca Juniors', '1905-04-03', 68, 1, 1),
      (2, 'Club Atlético River Plate', '1901-05-25', 66, 1, 1),
      (3, 'Club de Fútbol Barcelona', '1899-11-29', 96, 1, 3),
      (4, 'Real Madrid Club de Fútbol', '1902-03-06', 101, 1, 2),
      (5, 'Manchester United Football Club', '1878-10-15', 66, 1, 5),
      (6, 'Juventus Football Club', '1897-11-01', 69, 1, 4),
      (7, 'Bayern Munich', '1900-02-27', 76, 1, 6),
      (8, 'Paris Saint-Germain', '1970-08-12', 43, 1, 7),
      (9, 'Flamengo', '1895-11-17', 43, 1, 8),
      (10, 'Club Atlético de Madrid', '1903-04-26', 42, 1, 2)
      ;`
    );
  }

  // Cerrar la base de datos
  await db.close();
}

CrearBaseSiNoExiste();

module.exports = CrearBaseSiNoExiste;
