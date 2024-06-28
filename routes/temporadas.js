const express = require("express");
const router = express.Router();

const db = require("../base-orm/sequelize-init");

router.get("/api/temporadas", async function (req, res, next) {
  let data = await db.temporadas.findAll({
    attributes: ["Id_Temporada", "Año","FechaDesde","FechaHasta"],
  });
  res.json(data);
});


router.get("/api/temporadas/:id", async function (req, res, next) {
    let data = await db.temporadas.findAll({
      attributes: ["Id_Temporada", "Año","FechaDesde","FechaHasta"],
      where: { Id_Temporada: req.params.id },
    });
    if (data.length > 0 ) res.json(data[0]);
    else res.status(404).json({mensaje:'No encontrado!!'})
  });

module.exports = router;

