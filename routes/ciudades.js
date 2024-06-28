const express = require("express");
const router = express.Router();

const db = require("../base-orm/sequelize-init");

router.get("/api/ciudades", async function (req, res, next) {
  let data = await db.ciudades.findAll({
    attributes: ["idCiudad", "nombreCiudad"],
  });
  res.json(data);
});

router.get("/api/ciudades/:id", async function (req, res, next) {
  let data = await db.ciudades.findAll({
    attributes: ["idCiudad", "nombreCiudad"],
    where: { idCiudad: req.params.id },
  });
  if (data.length > 0) res.json(data[0]);
  else res.status(404).json({ mensaje: "No encontrado!!" });
});

module.exports = router;
