const express = require("express");
const router = express.Router();

const db = require("../base-orm/sequelize-init");

router.get("/api/posiciones", async function (req, res, next) {
  let data = await db.posiciones.findAll({
    attributes: ["IdPosicion", "Nombre"],
  });
  res.json(data);
});


router.get("/api/posiciones/:id", async function (req, res, next) {
    let data = await db.posiciones.findAll({
      attributes: ["IdPosicion", "Nombre"],
      where: { IdPosicion: req.params.id },
    });
    if (data.length > 0 ) res.json(data[0]);
    else res.status(404).json({mensaje:'No encontrado!!'})
  });

module.exports = router;
