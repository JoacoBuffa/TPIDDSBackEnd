const express = require("express");
const router = express.Router();
const db = require("../base-orm/sequelize-init");
const { Op, ValidationError } = require("sequelize");
const auth = require("../seguridad/auth");


router.get("/api/jugadores", async function (req, res, next) {

  let where = {};
  if (req.query.NombreApellido != undefined && req.query.NombreApellido !== "") {
    where.NombreApellido = {
      [Op.like]: "%" + req.query.NombreApellido + "%",
    };
  }
  if (req.query.Activo != undefined && req.query.Activo !== "") {
    // true o false en el modelo, en base de datos es 1 o 0
    // convertir el string a booleano
    where.Activo = req.query.Activo === "true";
  }
  const Pagina = req.query.Pagina ?? 1;
  const TamañoPagina = 10;
  const { count, rows } = await db.jugadores.findAndCountAll({
    attributes: [
      "IdJugador",
      "NombreApellido",
      "Dni",
      "FechaNacimiento",
      "Peso",
      "Altura",
      "IdPosicion",
      "Activo",
        ],
    order: [["NombreApellido", "ASC"]]
  });

  return res.json({ Items: rows, RegistrosTotal: count });
});

router.get("/api/jugadores/:id", async function (req, res, next) {
  let items = await db.jugadores.findOne({
    attributes: [
      "IdJugador",
      "NombreApellido",
      "Dni",
      "FechaNacimiento",
      "Peso",
      "Altura",
      "IdPosicion",
      "Activo",
    ],
    where: { IdJugador: req.params.id },
  });
  res.json(items);
});

router.post("/api/jugadores/", async (req, res) => {
  try {
    let data = await db.jugadores.create({
      NombreApellido: req.body.NombreApellido,
      Dni: req.body.Dni,
      FechaNacimiento: req.body.FechaNacimiento,
      Peso: req.body.Peso,
      Altura: req.body.Altura,
      IdPosicion: req.body.IdPosicion,
      Activo: req.body.Activo,
    });
    res.status(200).json(data.dataValues); // devolvemos el registro agregado!
  } catch (err) {
    if (err instanceof ValidationError) {
      // si son errores de validación, los devolvemos
      let messages = '';
      err.errors.forEach((x) => messages += (x.path ?? 'campo') + ": " + x.message + '\n');
      res.status(400).json({message : messages});
    } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});

router.put("/api/jugadores/:id", async (req, res) => {

  try {
    let item = await db.jugadores.findOne({
      attributes: [
       "IdJugador",
      "NombreApellido",
      "Dni",
      "FechaNacimiento",
      "Peso",
      "Altura",
      "IdPosicion",
      "Activo",
      ],
      where: { IdJugador: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "Jugador no encontrado" });
      return;
    }
    item.NombreApellido = req.body.NombreApellido;
    item.Dni = req.body.Dni;
    item.FechaNacimiento = req.body.FechaNacimiento;
    item.Peso = req.body.Peso;
    item.Altura = req.body.Altura;
    item.IdPosicion = req.body.IdPosicion;
    item.Activo = req.body.Activo;
    await item.save();

   
    res.sendStatus(204);
  } catch (err) {
    if (err instanceof ValidationError) {
      // si son errores de validación, los devolvemos
      let messages = '';
      err.errors.forEach((x) => messages += x.path + ": " + x.message + '\n');
      res.status(400).json({message : messages});
    } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});

router.delete("/api/jugadores/:id", async (req, res) => {

  let bajaFisica = false;

  if (bajaFisica) {
    // baja fisica
    let filasBorradas = await db.jugadores.destroy({
      where: { IdJugador: req.params.id },
    });
    if (filasBorradas == 1) res.sendStatus(200);
    else res.sendStatus(404);
  } else {
    // baja lógica
    try {
      let data = await db.sequelize.query(
        "UPDATE jugadores SET Activo = case when Activo = 1 then 0 else 1 end WHERE IdJugador = :IdJugador",
        {
          replacements: { IdJugador: +req.params.id },
        }
      );
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ValidationError) {
        // si son errores de validación, los devolvemos
        const messages = err.errors.map((x) => x.message);
        res.status(400).json(messages);
      } else {
        // si son errores desconocidos, los dejamos que los controle el middleware de errores
        throw err;
      }
    }
  }
});

  
module.exports = router;
