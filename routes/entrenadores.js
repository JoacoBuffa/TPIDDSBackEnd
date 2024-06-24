const express = require("express");
const router = express.Router();
const db = require("../base-orm/sequelize-init");
const { Op, ValidationError } = require("sequelize");

// GET /api/entrenadores
router.get("/api/entrenadores", async function (req, res, next) {
  try {
    const entrenadores = await db.entrenadores.findAll({
      attributes: [
        "id_Entrenador",
        "nombreEntrenador",
        "fechaNacimiento",
        "añosExperiencia",
        "tieneClub",
        "clubActual",
      ],
      order: [["nombreEntrenador", "ASC"]],
    });
    res.json(entrenadores);
  } catch (err) {
    next(err);
  }
});

// POST /api/entrenadores
router.post("/api/entrenadores", async (req, res, next) => {
  try {
    const entrenador = await db.entrenadores.create({
      nombreEntrenador: req.body.nombreEntrenador,
      fechaNacimiento: req.body.fechaNacimiento,
      añosExperiencia: req.body.añosExperiencia,
      id_tipoEntrenador: req.body.id_tipoEntrenador,
      tieneClub: req.body.tieneClub,
      clubActual: req.body.clubActual,
    });
    res.status(201).json(entrenador);
  } catch (err) {
    if (err instanceof ValidationError) {
      const messages = err.errors.map((x) => x.message);
      res.status(400).json(messages);
    } else {
      next(err);
    }
  }
});

// PUT /api/entrenadores/:id
router.put("/api/entrenadores/:id", async (req, res, next) => {
  try {
    const entrenador = await db.entrenadores.findByPk(req.params.id);
    if (!entrenador) {
      res.status(404).json({ message: "Entrenador no encontrado" });
      return;
    }

    entrenador.nombreEntrenador = req.body.nombreEntrenador;
    entrenador.fechaNacimiento = req.body.fechaNacimiento;
    entrenador.añosExperiencia = req.body.añosExperiencia;
    entrenador.id_tipoEntrenador = req.body.id_tipoEntrenador;
    entrenador.tieneClub = req.body.tieneClub;
    entrenador.clubActual = req.body.clubActual;

    await entrenador.save();
    res.sendStatus(204);
  } catch (err) {
    if (err instanceof ValidationError) {
      const messages = err.errors.map((x) => x.message);
      res.status(400).json(messages);
    } else {
      next(err);
    }
  }
});

// DELETE /api/entrenadores/:id
router.delete("/api/entrenadores/:id", async (req, res, next) => {
  try {
    const result = await db.entrenadores.destroy({
      where: {
        id_Entrenador: req.params.id,
      },
    });

    if (result === 1) {
      res.sendStatus(200);
    } else {
      res.status(404).json({ message: "Entrenador no encontrado" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
