const db = require("aa-sqlite");

async function CrearBaseSiNoExiste() {
  // Abrir base de datos, crearla si no existe
  await db.open("./.data/TPI.db");

  let existe = false;
  let res = null;

  // Verificar si la tabla TipoEntrenador existe, si no existe, crearla
  existe = false;
  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'tipoEntrenador'",
    []
  );
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      `CREATE TABLE tipoEntrenador( 
              id_tipoEntrenador INTEGER PRIMARY KEY AUTOINCREMENT,
              nombreTipoEntrenador TEXT NOT NULL 
            );`
    );
    console.log("Tabla tipoEntrenador creada!");

    await db.run(
      `INSERT INTO tipoEntrenador VALUES 
      
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
              Activo BOOLEAN,
              FOREIGN KEY (id_tipoEntrenador) REFERENCES TipoEntrenador(id_tipoEntrenador)
            );`
    );
    console.log("Tabla entrenadores creada!");
    // Insertar entrenadores
    await db.run(
      `INSERT INTO entrenadores (id_Entrenador, nombreEntrenador, fechaNacimiento, añosExperiencia, id_tipoEntrenador, tieneClub, clubActual, Activo)
    VALUES
      (1, 'Diego Simeone', '1970-04-28', 15, 1, 1, 'Atletico de Madrid', 1),
      (2, 'Marcelo Bielsa', '1955-07-21', 25, 1, 1, 'Leeds United', 1),
      (3, 'Pep Guardiola', '1971-01-18', 20, 1, 1, 'Manchester City', 1),
      (4, 'Juan Carlos Osorio', '1961-06-08', 22, 2, 1, 'Atletico Nacional', 1),
      (5, 'Francisco Ayestaran', '1963-02-22', 18, 3, 0, 'Barcelona', 1),
      (6, 'Jorge Desio', '1976-08-15', 12, 4, 1, 'Real Madrid', 1),
      (7, 'Carlos Velasco Carballo', '1971-03-17', 10, 5, 0, 'Racing', 1),
      (8, 'Rafael Guerrero', '1980-09-12', 8, 2, 1, 'Sevilla FC', 1),
      (9, 'Pepe Conde', '1985-11-05', 5, 3, 0, 'Talleres', 1),
      (10, 'Marta López', '1990-07-30', 3, 5, 0, 'Independiente', 1);`
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
    console.log("tabla ciudades creada!");
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

  // Posiciones
  existe = false;
  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'posiciones'",
    []
  );
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      "CREATE table posiciones( IdPosicion INTEGER PRIMARY KEY AUTOINCREMENT, Nombre text NOT NULL UNIQUE);"
    );
    console.log("tabla posiciones creada!");
    await db.run(
      "insert into posiciones values	(1,'Arquero'),(2,'Defensor Central'),(3,'Lateral Izquierdo'),(4,'Lateral Derecho'),(5,'Mediocampista Defensivo'),(6,'Mediocampista'),(7,'Mediocampista Ofensivo'),(8,'Extremo Izquierdo'),(9,'Extremo Derecho'),(10,'Delantero Central');"
    );
  }

  // JUGADORES
  existe = false;
  sql =
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'jugadores'";
  res = await db.get(sql, []);
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      `CREATE table jugadores( 
              IdJugador INTEGER PRIMARY KEY AUTOINCREMENT
            , NombreApellido text NOT NULL 
                        , Dni integer
            , FechaNacimiento text
            , Peso integer
                        , Altura integer
            , IdPosicion integer
            , Activo boolean,
            FOREIGN KEY (IdPosicion) REFERENCES posiciones(IdPosicion)
            );`
    );
    console.log("tabla jugadores creada!");

    await db.run(
      `INSERT INTO Jugadores (IdJugador, NombreApellido, FechaNacimiento, Dni, Activo, Altura, Peso, IdPosicion) VALUES
(1, 'Juan Fernando Quintero', '1993-01-18', 40003000, 1, 1.72, 90, 6),
(2, 'Radamel Falcao Garcia', '1986-02-19', 40003001, 1, 1.77, 80, 10),
(3, 'James Rodriguez', '1991-07-12', 40003002, 1, 1.80, 85, 7),
(4, 'David Ospina', '1988-08-31', 40003003, 1, 1.85, 90, 1),
(5, 'Yerry Mina', '1994-12-09', 40003004, 1, 1.88, 86, 2),
(6, 'Alexis McAllister', '1998-12-24', 40003005, 1, 1.85, 90, 6),
(7, 'Lionel Messi', '1987-06-24', 40003006, 1, 1.70, 75, 10),
(8, 'Neymar Jr', '1992-02-05', 40003007, 1, 1.75, 80, 9),
(9, 'Kylian Mbappe', '1998-12-20', 40003008, 1, 1.78, 85, 9),
(10, 'Cristiano Ronaldo', '1985-02-05', 40003009, 1, 1.85, 90, 10)`
    );
  }

  // Cerrar la base de datos
  await db.close();
}

CrearBaseSiNoExiste();

module.exports = CrearBaseSiNoExiste;
