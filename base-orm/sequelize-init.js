const { Sequelize, DataTypes } = require("sequelize");

// Configurar conexión a la base de datos SQLite
const sequelize = new Sequelize("sqlite:" + "./.data/TPI.db");

// Definición del modelo TipoEntrenador
const TipoEntrenador = sequelize.define(
  "TipoEntrenador",
  {
    id_tipoEntrenador: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreTipoEntrenador: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        args: true,
        msg: "Este tipo de entrenador ya existe",
      },
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
    hooks: {
      beforeValidate: function (tipoEntrenador, options) {
        if (typeof tipoEntrenador.nombreTipoEntrenador === "string") {
          tipoEntrenador.nombreTipoEntrenador =
            tipoEntrenador.nombreTipoEntrenador.trim();
        }
      },
    },
    timestamps: false,
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
      unique: {
        args: true,
        msg: "Este entrenador ya existe",
      },
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
        min: {
          args: 0,
          msg: "Años de experiencia no pueden ser negativos",
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
  },
  {
    hooks: {
      beforeValidate: function (entrenador, options) {
        if (typeof entrenador.nombreEntrenador === "string") {
          entrenador.nombreEntrenador = entrenador.nombreEntrenador.trim();
        }
        if (typeof entrenador.clubActual === "string") {
          entrenador.clubActual = entrenador.clubActual.trim();
        }
      },
    },
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
  } ,
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
        }
      }
    },

    torneosGanados: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "cantidad de torneos ganados es requerido",
        }
      }
    },

    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "activo es requerido",
        }
      }
    },

    idCiudad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "idCiudad es requerido",
        }
      }
    },
  } ,
  {

    timestamps: false,
  }
);


// Relación entre entrenadores y TipoEntrenador (opcional)
entrenadores.belongsTo(TipoEntrenador, {
  foreignKey: "id_tipoEntrenador",
  as: "tipoEntrenador",
});

// Sincronizar modelos con la base de datos (opcional si se quiere crear automáticamente las tablas)
// sequelize.sync();

module.exports = {
  sequelize,
  TipoEntrenador,
  entrenadores,
  ciudades,
  clubes
};
