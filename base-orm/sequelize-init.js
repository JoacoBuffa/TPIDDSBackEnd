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
    hooks: {
      beforeValidate: function (tipoEntrenador, options) {
        if (typeof tipoEntrenador.nombreTipoEntrenador === "string") {
          tipoEntrenador.nombreTipoEntrenador =
            tipoEntrenador.nombreTipoEntrenador.toUpperCase().trim();
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
    hooks: {
      beforeValidate: function (entrenador, options) {
        if (typeof entrenador.nombreEntrenador === "string") {
          entrenador.nombreEntrenador = entrenador.nombreEntrenador
            .toUpperCase()
            .trim();
        }
      },
    },
    timestamps: false,
  }
);

// Sincronizar modelos con la base de datos (opcional si se quiere crear automáticamente las tablas)
// sequelize.sync();

module.exports = {
  sequelize,
  tipoEntrenador,
  entrenadores,
};
