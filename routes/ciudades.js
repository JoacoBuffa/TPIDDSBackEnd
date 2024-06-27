const express = require('express');
const { Op, ValidationError } = require("sequelize");
const router = express.Router();
const db = require("../base-orm/sequelize-init");

// Obtener todas las ciudades
router.get('/api/ciudades', async (req, res) => {
  try {
    let where = {};
    if (req.query.nombreCiudad != undefined && req.query.nombreCiudad !== "") {
      where.nombreCiudad = {
        [Op.like]: "%" + req.query.nombreCiudad + "%",
      };
    }    
    const Pagina = req.query.Pagina ?? 1;
    const TamañoPagina = 10;    
    const { count, rows } = await db.ciudades.findAndCountAll({
        attributes: [
          "idCiudad",
          "nombreCiudad"
        ],
        order: [["nombreCiudad", "ASC"]],
        where,
        offset: (Pagina - 1) * TamañoPagina,
        limit: TamañoPagina,
      });
    
      return res.json({ Items: rows, RegistrosTotal: count });  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ciudades' });
  }
});

// Obtener una ciudad por su Id
router.get('/api/ciudades/:id', async (req, res) => {
  try {
    const ciudad = await db.ciudades.findByPk(req.params.id);
    if (ciudad) {
      res.json(ciudad);
    } else {
      res.status(404).json({ error: 'Ciudad no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la ciudad' });
  }
});


// POST MODIFICADO
router.post("/api/ciudades", async (req, res) => {
  // #swagger.tags = ['Articulos']
  // #swagger.summary = 'agrega un Articulo'
  /*    #swagger.parameters['item'] = {
                in: 'body',
                description: 'nuevo Artículo',
                schema: { $ref: '#/definitions/Articulos' }
    } */
  try {
    let data = await db.ciudades.create({
      nombreCiudad: req.body.nombreCiudad,
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


// Actualizar una ciudad existente
router.put('/api/ciudades/:id', async (req, res) => {
  try {
    const [numFilasActualizadas, ciudadActualizada] = await db.ciudades.update(req.body, {
      where: { idCiudad: req.params.id },
      returning: true,
    });
    if (ciudadActualizada === 1) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'ciudad no encontrada' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar una ciudad existente
router.delete('/api/ciudades/:id', async (req, res) => {
  try {
    const numFilasEliminadas = await db.ciudades.destroy({
      where: { idCiudad: req.params.id },
    });
    if (numFilasEliminadas === 1) {
      res.json({ message: 'ciudad eliminada correctamente' });
    } else {
      res.status(404).json({ error: 'ciudad no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la ciudad' });
  }
});


module.exports = router;