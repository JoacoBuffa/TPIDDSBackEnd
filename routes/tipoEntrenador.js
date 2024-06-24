const express = require("express");
const router = express.Router();
const db = require("../base-orm/sequelize-init");
const { Op, ValidationError } = require("sequelize");

// GET /api/tipoEntrenador
router.get("/api/tipoEntrenador", async function (req, res, next) {
  try {
    const tiposEntrenador = await db.TipoEntrenador.findAll({
      attributes: ["id_tipoEntrenador", "nombreTipoEntrenador"],
      order: [["nombreTipoEntrenador", "ASC"]],
    });
    res.json(tiposEntrenador);
  } catch (err) {
    next(err);
  }
});

// POST /api/tipoEntrenador
router.post("/api/tipoEntrenador", async (req, res, next) => {
  try {
    const tipoEntrenador = await db.TipoEntrenador.create({
      nombreTipoEntrenador: req.body.nombreTipoEntrenador,
    });
    res.status(201).json(tipoEntrenador);
  } catch (err) {
    if (err instanceof ValidationError) {
      const messages = err.errors.map((x) => x.message);
      res.status(400).json(messages);
    } else {
      next(err);
    }
  }
});

module.exports = router;
