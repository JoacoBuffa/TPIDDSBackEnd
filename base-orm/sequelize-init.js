const { Sequelize, DataTypes } = require("sequelize");

// Configurar conexión a la base de datos SQLite
const sequelize = new Sequelize("sqlite:" + "./.data/TPI.db");

// Definición del modelo tipoEntrenador
const tipoEntrenador = sequelize.define(
  "tipoEntrenador",
  {
    id_tipoEntrenador: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreTipoEntrenador: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre del tipo de entrenador es requerido",
        },
        len: {
          args: [3, 50],
          msg: "Nombre del tipo de entrenador debe tener entre 3 y 50 caracteres",
        },
      },
    },
  },
  {
    timestamps: false,
    tableName: "tipoEntrenador",
  }
);

// Definición del modelo entrenadores
const entrenadores = sequelize.define(
  "entrenadores",
  {
    id_Entrenador: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreEntrenador: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre del entrenador es requerido",
        },
        len: {
          args: [3, 50],
          msg: "Nombre del entrenador debe tener entre 3 y 50 caracteres",
        },
      },
    },
    fechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Fecha de nacimiento es requerida",
        },
        isDate: {
          args: true,
          msg: "Fecha de nacimiento debe ser una fecha válida",
        },
      },
    },
    añosExperiencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Años de experiencia son requeridos",
        },
      },
    },
    id_tipoEntrenador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Tipo de entrenador es requerido",
        },
      },
    },
    tieneClub: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        notNull: {
          args: true,
          msg: "Campo 'tieneClub' es requerido",
        },
      },
    },
    clubActual: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: {
          args: [0, 50],
          msg: "Nombre del club actual debe tener máximo 50 caracteres",
        },
      },
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Activo es requerido",
        },
      },
    },
  },
  {
    timestamps: false,
  }
);

// CIUDADES definicion de modelo

const ciudades = sequelize.define(
  "ciudades",
  {
    idCiudad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreCiudad: {
      // todo evitar que string autocomplete con espacios en blanco, debería ser varchar sin espacios
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre ciudad es requerido",
        },
        len: {
          args: [3, 40],
          msg: "Nombre ciudad debe ser tipo caracteres, entre 3 y 40 de longitud",
        },
      },
    },
  },
  {
    timestamps: false,
  }
);

// CLUBES definicion de modelo

const clubes = sequelize.define(
  "clubes",
  {
    idClub: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreClub: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre CLUB es requerido",
        },
        len: {
          args: [5, 60],
          msg: "Nombre CLUB debe ser tipo caracteres, entre 5 y 60 de longitud",
        },
      },
      unique: {
        args: true,
        msg: "este Nombre ya existe en la tabla!",
      },
    },

    fechaCreacion: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "fechaCreacion es requerido",
        },
      },
    },

    torneosGanados: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "cantidad de torneos ganados es requerido",
        },
      },
    },

    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "activo es requerido",
        },
      },
    },

    idCiudad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "idCiudad es requerido",
        },
      },
    },
  },
  {
    timestamps: false,
  }
);

clubes.belongsTo(ciudades, { foreignKey: "idCiudad" });
ciudades.hasOne(clubes, { foreignKey: "idCiudad" });

// Relación entre entrenadores y TipoEntrenador (opcional)
entrenadores.belongsTo(tipoEntrenador, { foreignKey: "id_tipoEntrenador" });
tipoEntrenador.hasOne(entrenadores, { foreignKey: "id_tipoEntrenador" });

// Definición del modelo posiciones
const posiciones = sequelize.define(
  "posiciones",
  {
    IdPosicion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      // todo evitar que string autocomplete con espacios en blanco, debería ser varchar sin espacios
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [5, 30],
          msg: "Nombre debe ser tipo caracteres, entre 5 y 30 de longitud",
        },
      },
    },
  },
  {
    timestamps: false,
  }
);

// Definición del modelo jugadores
const jugadores = sequelize.define(
  "jugadores",
  {
    IdJugador: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    NombreApellido: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre y apellido es requerido",
        },
        len: {
          args: [5, 60],
          msg: "Nombre y apellido debe ser tipo caracteres, entre 5 y 60 de longitud",
        },
      },
      unique: {
        args: true,
        msg: "este Nombre y apellido ya existe en la tabla!",
      },
    },
    Dni: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "DNI es requerido",
        },
      },
    },
    FechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Fecha Nacimiento es requerido",
        },
      },
    },
    Peso: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Peso es requerido",
        },
      },
    },
    Altura: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Altura es requerido",
        },
      },
    },
    IdPosicion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "IdPosicion es requerido",
        },
      },
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Activo es requerido",
        },
      },
    },
  },
  {
    timestamps: false,
  }
);

// TEMPORADAS definicion de modelo

const temporadas = sequelize.define(
  "temporadas",
  {
    Id_Temporada: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Año: {
      type: DataTypes.STRING(9),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Años de temporada es requerido",
        },
        len: {
          args: [4,9],
          msg: "Años de temporada debe tener entre 4 y 9 caracteres de longitud",
        },
      },
      unique: {
        args: true,
        msg: "La temporada de este/estos años ya esta creada!",
      },
    },

    FechaDesde: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "fecha de inicio de temporada es requerido",
        },
      },
    },

    FechaHasta: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "fecha de fin de temporada es requerido",
        },
      },
    },
  },
  {
    timestamps: false,
  }
);


// torneos definicion de modelo

const torneos = sequelize.define(
  "torneos",
  {
    ID_Torneo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre_torneo: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre del torneo es requerido",
        },
        len: {
          args: [5, 60],
          msg: "Nombre del torneo debe ser tipo caracteres, entre 5 y 60 de longitud",
        },
      },
      unique: {
        args: true,
        msg: "este Nombre ya existe en la tabla!",
      },
    },

    fechaDeFinal: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "fecha de final es requerido",
        },
      },
    },

    PromedioGoles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "promedio de goles del torneo es requerido",
        },
      },
    },

    Finalizado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Finalizado es requerido",
        },
      },
    },

    Id_Temporada: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Temporada es requerido",
        },
      },
    },
  },
  {
    timestamps: false,
  }
);

torneos.belongsTo(temporadas, { foreignKey: "Id_Temporada" });
temporadas.hasOne(torneos, { foreignKey: "Id_Temporada" });



// Sincronizar modelos con la base de datos (opcional si se quiere crear automáticamente las tablas)
// sequelize.sync();

module.exports = {
  sequelize,
  tipoEntrenador,
  entrenadores,
  ciudades,
  clubes,
  posiciones,
  jugadores,
  temporadas,
  torneos
};
