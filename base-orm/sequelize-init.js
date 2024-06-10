// configurar ORM sequelize
const { Sequelize, DataTypes } = require("sequelize");
//const sequelize = new Sequelize("sqlite:" + process.env.base );
const sequelize = new Sequelize("sqlite:" + "./.data/pymes.db");

// definicion del modelo de datos
const articulosfamilias = sequelize.define(
  "articulosfamilias",
  {
    IdArticuloFamilia: {
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
    // pasar a mayusculas
    hooks: {
      beforeValidate: function (articulofamilia, options) {
        if (typeof articulofamilia.Nombre === "string") {
          articulofamilia.Nombre = articulofamilia.Nombre.toUpperCase().trim();
        }
      },
    },

    timestamps: false,
  }
);

const articulos = sequelize.define(
  "articulos",
  {
    IdArticulo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [5, 60],
          msg: "Nombre debe ser tipo caracteres, entre 5 y 60 de longitud",
        },
      },
      unique: {
        args: true,
        msg: "este Nombre ya existe en la tabla!",
      },
    },
    Precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Precio es requerido",
        }
      }
    },
    CodigoDeBarra: {
      type: DataTypes.STRING(13),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Codigo De Barra es requerido",
        },
        is: {
          args: ["^[0-9]{13}$", "i"],
          msg: "Codigo de Barra debe ser numérico de 13 digitos",
        },
      },
    },
    IdArticuloFamilia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "IdArticuloFamilia es requerido",
        }
      }
    },
    Stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Stock es requerido",
        }
      }
    },
    FechaAlta: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Fecha Alta es requerido",
        }
      }
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Activo es requerido",
        }
      }
    },
  },
  {
    // pasar a mayusculas
    hooks: {
      beforeValidate: function (articulo, options) {
        if (typeof articulo.Nombre === "string") {
          articulo.Nombre = articulo.Nombre.toUpperCase().trim();
        }
      },
    },

    timestamps: false,
  }
);


const empleados = sequelize.define('empleados', {
  IdEmpleado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },  
  ApellidoYNombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: "Apellido y Nombre es requerido",
      },
      len: {
        args: [5, 60],
        msg: "Apellido y Nombre debe ser tipo caracteres, entre 5 y 50 de longitud",
      },
    },
  },
  Dni: {
    type: DataTypes.INTEGER,    
    notNull: {
      args: true,
      msg: "DNI es requerido",
    },
    unique: {
      args: true,
      msg: "Este DNI ya existe en la tabla!",
    }       
  },
  FechaNacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    notNull: {
      args: true,
      msg: "Fecha Nacimiento es requerido",
    }

  },
  Suspendido: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    notNull: {
      args: true,
      msg: "Suspendido requerido",
    }    
  }
},
{
  // pasar a mayusculas
  hooks: {
    beforeValidate: function (empleado, options) {
      if (typeof empleado.ApellidoYNombre === "string") {
        empleado.ApellidoYNombre = empleado.ApellidoYNombre.toUpperCase().trim();
      }
    },
  },

  timestamps: false,
}

);

module.exports = {
  sequelize,
  articulosfamilias,
  articulos,
  empleados
};
