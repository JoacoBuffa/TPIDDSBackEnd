const express = require('express');
const { Op, ValidationError } = require("sequelize");
const router = express.Router();
const db = require("../base-orm/sequelize-init");

// Obtener todos los empleados
router.get('/api/empleados', async (req, res) => {
  try {
    let where = {};
    if (req.query.ApellidoYNombre != undefined && req.query.ApellidoYNombre !== "") {
      where.ApellidoYNombre = {
        [Op.like]: "%" + req.query.ApellidoYNombre + "%",
      };
    }    
    const Pagina = req.query.Pagina ?? 1;
    const TamañoPagina = 10;    
    const { count, rows } = await db.empleados.findAndCountAll({
        attributes: [
          "IdEmpleado",
          "ApellidoYNombre",
          "FechaNacimiento",
          "Dni",
          "Suspendido"
        ],
        order: [["ApellidoYNombre", "ASC"]],
        where,
        offset: (Pagina - 1) * TamañoPagina,
        limit: TamañoPagina,
      });
    
      return res.json({ Items: rows, RegistrosTotal: count });  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los empleados' });
  }
});

// Obtener un empleado por su Id
router.get('/api/empleados:id', async (req, res) => {
  try {
    const empleado = await db.empleados.findByPk(req.params.id);
    if (empleado) {
      res.json(empleado);
    } else {
      res.status(404).json({ error: 'Empleado no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el empleado' });
  }
});

// Crear un nuevo empleado
router.post('/api/empleados', async (req, res) => {
  try {
    const nuevoEmpleado = await db.empleados.create(req.body);
    res.status(200).json(nuevoEmpleado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar un empleado existente
router.put('/api/empleados/:id', async (req, res) => {
  try {
    const [numFilasActualizadas, empleadoActualizado] = await db.empleados.update(req.body, {
      where: { IdEmpleado: req.params.id },
      returning: true,
    });
    if (empleadoActualizado === 1) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'Empleado no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar un empleado existente
router.delete('/api/empleados/:id', async (req, res) => {
  try {
    const numFilasEliminadas = await db.empleados.destroy({
      where: { IdEmpleado: req.params.id },
    });
    if (numFilasEliminadas === 1) {
      res.json({ message: 'Empleado eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Empleado no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el empleado' });
  }
});

module.exports = router;