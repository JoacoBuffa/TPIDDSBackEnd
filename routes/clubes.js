const express = require('express');
const { Op, ValidationError } = require("sequelize");
const router = express.Router();
const db = require("../base-orm/sequelize-init");

// Obtener todos los clubes
router.get('/api/clubes', async (req, res) => {
  try {
    let where = {};
    if (req.query.nombreClub != undefined && req.query.nombreClub !== "") {
      where.nombreClub = {
        [Op.like]: "%" + req.query.nombreClub + "%",
      };
    }    
    const Pagina = req.query.Pagina ?? 1;
    const TamañoPagina = 10;    
    const { count, rows } = await db.clubes.findAndCountAll({
        attributes: [
          "idClub",
          "nombreClub",
          "fechaCreacion",
          "torneosGanados",
          "activo",
          "idCiudad"
        ],
        order: [["nombreClub", "ASC"]],
        where,
        offset: (Pagina - 1) * TamañoPagina,
        limit: TamañoPagina,
      });
    
      return res.json({ Items: rows, RegistrosTotal: count });  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los clubes' });
  }
});

// Obtener un club por su Id
router.get('/api/clubes/:id', async (req, res) => {
  try {
    const club = await db.clubes.findByPk(req.params.id);
    if (club) {
      res.json(club);
    } else {
      res.status(404).json({ error: 'club no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el club' });
  }
});


// POST MODIFICADO
router.post("/api/clubes", async (req, res) => {
  try {
    let data = await db.clubes.create({
      nombreClub: req.body.nombreClub,
      fechaCreacion: req.body.fechaCreacion,
      torneosGanados: req.body.torneosGanados,
      activo: req.body.activo,
      idCiudad: req.body.idCiudad
    
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


// Actualizar un club existente
router.put('/api/clubes/:id', async (req, res) => {
  try {
    const [numFilasActualizadas, clubActualizado] = await db.clubes.update(req.body, {
      where: { idClub: req.params.id },
      returning: true,
    });
    if (clubActualizado === 1) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'club no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar un club existente
router.delete('/api/clubes/:id', async (req, res) => {
  try {
    const numFilasEliminadas = await db.clubes.destroy({
      where: { idClub: req.params.id },
    });
    if (numFilasEliminadas === 1) {
      res.json({ message: 'club eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'club no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el club' });
  }
});




module.exports = router;