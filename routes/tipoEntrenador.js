const express = require("express");
const router = express.Router();

const db = require("../base-orm/sequelize-init");

router.get("/api/tipoEntrenador", async function (req, res, next) {
  let data = await db.tipoEntrenador.findAll({
    attributes: ["id_tipoEntrenador", "nombreTipoEntrenador"],
  });
  res.json(data);
});

router.get("/api/tipoEntrenador/:id", async function (req, res, next) {
  let data = await db.tipoEntrenador.findAll({
    attributes: ["id_tipoEntrenador", "nombreTipoEntrenador"],
    where: { id_tipoEntrenador: req.params.id },
  });
  if (data.length > 0) res.json(data[0]);
  else res.status(404).json({ mensaje: "No encontrado!!" });
});

module.exports = router;
