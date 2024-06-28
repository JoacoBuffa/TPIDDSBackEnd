const express = require("express");
const router = express.Router();
const db = require("../base-orm/sequelize-init");
const { Op, ValidationError } = require("sequelize");


router.get("/api/jugadores", async function (req, res) {
  try {
    let where = {};
    if (req.query.NombreApellido != undefined && req.query.NombreApellido !== "") {
      where.NombreApellido = {
        [Op.like]: "%" + req.query.NombreApellido + "%",
      };
    }    
    const Pagina = req.query.Pagina || 1;
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
        order: [["NombreApellido", "ASC"]],
        where,
        offset: (Pagina - 1) * TamañoPagina,
        limit: TamañoPagina,
      });
    
    return res.json({ Items: rows, RegistrosTotal: count });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los jugadores' });
  }
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
      let messages = "";
      err.errors.forEach(
        (x) => (messages += (x.path ?? "campo") + ": " + x.message + "\n")
      );
      res.status(400).json({ message: messages });
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
      let messages = "";
      err.errors.forEach((x) => (messages += x.path + ": " + x.message + "\n"));
      res.status(400).json({ message: messages });
    } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});

router.delete("/api/jugadores/:id", async (req, res) => {
  try {
    const numFilasEliminadas = await db.jugadores.destroy({
      where: { IdJugador: req.params.id },
    });
    if (numFilasEliminadas === 1) {
      res.json({ message: "Jugador eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Jugador no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el Jugador" });
  }
});

router.put("/api/jugadores/suspender/:id", async (req, res) => {
  try {
    let item = await db.jugadores.findOne({
      attributes: ["IdJugador", "activo"],
      where: { IdJugador: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "Jugador no encontrado" });
      return;
    }
    item.activo = req.body.activo;
    await item.save();

    res.sendStatus(204);
  } catch (err) {
    if (err instanceof ValidationError) {
      let messages = "";
      err.errors.forEach((x) => (messages += x.path + ": " + x.message + "\n"));
      res.status(400).json({ message: messages });
    } else {
      throw err;
    }
  }
});

module.exports = router;
