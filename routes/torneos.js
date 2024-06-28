const express = require('express');
const { Op, ValidationError } = require("sequelize");
const router = express.Router();
const db = require("../base-orm/sequelize-init");

// Obtener todos los torneos
router.get('/api/torneos', async (req, res) => {
  try {
    let where = {};
    if (req.query.Nombre_torneo != undefined && req.query.Nombre_torneo !== "") {
      where.Nombre_torneo = {
        [Op.like]: "%" + req.query.Nombre_torneo + "%",
      };
    }    
    const Pagina = req.query.Pagina ?? 1;
    const TamañoPagina = 10;    
    const { count, rows } = await db.torneos.findAndCountAll({
        attributes: [
          "ID_Torneo",
          "Nombre_torneo",
          "fechaDeFinal",
          "PromedioGoles",
          "Finalizado",
          "Id_Temporada"
        ],
        order: [["Nombre_torneo", "ASC"]],
        where,
        offset: (Pagina - 1) * TamañoPagina,
        limit: TamañoPagina,
      });
    
      return res.json({ Items: rows, RegistrosTotal: count });  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los torneos' });
  }
});

// Obtener un empleado por su Id
router.get('/api/torneos/:id', async (req, res) => {
  try {
    const torneo = await db.torneos.findByPk(req.params.id);
    if (torneo) {
      res.json(torneo);
    } else {
      res.status(404).json({ error: 'Torneo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el torneo' });
  }
});

// // Crear un nuevo empleado
// router.post('/api/empleados', async (req, res) => {
//   try {
//     const nuevoEmpleado = await db.empleados.create(req.body);
//     res.status(200).json(nuevoEmpleado);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// POST MODIFICADO
router.post("/api/torneos", async (req, res) => {
  // #swagger.tags = ['Articulos']
  // #swagger.summary = 'agrega un Articulo'
  /*    #swagger.parameters['item'] = {
                in: 'body',
                description: 'nuevo Artículo',
                schema: { $ref: '#/definitions/Articulos' }
    } */
  try {
    let data = await db.torneos.create({
      Nombre_torneo: req.body.Nombre_torneo,
      fechaDeFinal: req.body.fechaDeFinal,
      PromedioGoles: req.body.PromedioGoles,
      Finalizado: req.body.Finalizado,
      Id_Temporada: req.body.Id_Temporada
    
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


// Actualizar un torneo existente
router.put('/api/torneos/:id', async (req, res) => {
  try {
    const [numFilasActualizadas, torneoActualizado] = await db.torneos.update(req.body, {
      where: { ID_Torneo: req.params.id },
      returning: true,
    });
    if (torneoActualizado === 1) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'torneo no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar un torneo existente
router.delete('/api/torneos/:id', async (req, res) => {
  try {
    const numFilasEliminadas = await db.torneos.destroy({
      where: { ID_Torneo: req.params.id },
    });
    if (numFilasEliminadas === 1) {
      res.json({ message: 'torneo eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'torneo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el torneo' });
  }
});

//Modificar el estado de un equipo
router.put("/api/torneo/suspender/:id", async (req, res) => {
  try {
    let item = await db.torneos.findOne({
      attributes: ["ID_Torneo", "Finalizado"],
      where: { ID_Torneo: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "torneo no encontrado" });
      return;
    }
    item.Finalizado = req.body.Finalizado;
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