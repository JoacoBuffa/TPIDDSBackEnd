const express = require("express");
const { Op, ValidationError } = require("sequelize");
const router = express.Router();
const db = require("../base-orm/sequelize-init");

// Obtener todos los empleados
router.get("/api/entrenadores", async (req, res) => {
  try {
    let where = {};
    if (
      req.query.nombreEntrenador != undefined &&
      req.query.nombreEntrenador !== ""
    ) {
      where.nombreEntrenador = {
        [Op.like]: "%" + req.query.nombreEntrenador + "%",
      };
    }
    if (req.query.Suspendido != undefined && req.query.Suspendido !== "") {
      // true o false en el modelo, en base de datos es 1 o 0
      // convertir el string a booleano
      where.Suspendido = req.query.Suspendido === "true";
    }
    const Pagina = req.query.Pagina ?? 1;
    const TamañoPagina = 10;
    const { count, rows } = await db.entrenadores.findAndCountAll({
      attributes: [
        "id_Entrenador",
        "nombreEntrenador",
        "fechaNacimiento",
        "añosExperiencia",
        "id_tipoEntrenador",
        "tieneClub",
        "clubActual",
        "Suspendido",
      ],
      order: [["nombreEntrenador", "ASC"]],
      where,
      offset: (Pagina - 1) * TamañoPagina,
      limit: TamañoPagina,
    });

    return res.json({ Items: rows, RegistrosTotal: count });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los Entrenadores" });
  }
});

// Obtener un entrenadores por su Id
router.get("/api/entrenadores/:id", async (req, res) => {
  try {
    const entrenador = await db.entrenadores.findByPk(req.params.id);
    if (entrenador) {
      res.json(entrenador);
    } else {
      res.status(404).json({ error: "entrenador no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el entrenador" });
  }
});

// Crear un nuevo empleado
// post d articulos modificado
router.post("/api/entrenadores", async (req, res) => {
  // #swagger.tags = ['Articulos']
  // #swagger.summary = 'agrega un Articulo'
  /*    #swagger.parameters['item'] = {
                in: 'body',
                description: 'nuevo Artículo',
                schema: { $ref: '#/definitions/Articulos' }
    } */
  try {
    let data = await db.entrenadores.create({
      nombreEntrenador: req.body.nombreEntrenador,
      fechaNacimiento: req.body.fechaNacimiento,
      CodigoDeBañosExperienciaarra: req.body.añosExperiencia,
      id_tipoEntrenador: req.body.id_tipoEntrenador,
      tieneClub: req.body.tieneClub,
      clubActual: req.body.clubActual,
      Suspendido: req.body.Suspendido,
    });
    res.status(200).json(data.dataValues); // devolvemos el registro agregado!
  } catch (err) {
    if (err instanceof ValidationError) {
      // si son errores de validación, los devolvemos
      let messages = "";
      err.errors.forEach(
        (x) => (messages += (x.path ?? "campo") + ": " + x.message + "\n")
      );
      res.status(400).json({ message: messages });
    } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});

// Actualizar un empleado existente
router.put("/api/entrenadores/:id", async (req, res) => {
  try {
    let item = await db.equipos.findOne({
      attributes: [
        "id_Entrenador",
        "nombreEntrenador",
        "fechaNacimiento",
        "añosExperiencia",
        "id_tipoEntrenador",
        "tieneClub",
        "clubActual",
        "Suspendido",
      ],
      where: { id_Entrenador: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "id_Entrenador no encontrado" });
      return;
    }
    item.nombreEntrenador = req.body.nombreEntrenador;
    item.fechaNacimiento = req.body.fechaNacimiento;
    item.añosExperiencia = req.body.añosExperiencia;
    item.id_tipoEntrenador = req.body.id_tipoEntrenador;
    item.tieneClub = req.tieneClub.Stock;
    item.clubActual = req.body.clubActual;
    item.Suspendido = req.body.Suspendido;
    await item.save();

    res.sendStatus(204);
  } catch (err) {
    if (err instanceof ValidationError) {
      // si son errores de validación, los devolvemos
      let messages = "";
      err.errors.forEach((x) => (messages += x.path + ": " + x.message + "\n"));
      res.status(400).json({ message: messages });
    } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});

// Eliminar un empleado existente
router.delete("/api/entrenadores/:id", async (req, res) => {
  try {
    const numFilasEliminadas = await db.entrenadores.destroy({
      where: { id_Entrenador: req.params.id },
    });
    if (numFilasEliminadas === 1) {
      res.json({ message: "Entrenador eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Entrenador no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el Entrenador" });
  }
});

//Modificar el estado de un equipo
router.put("/api/entrenadores/suspender/:id", async (req, res) => {
  try {
    let item = await db.entrenadores.findOne({
      attributes: ["id_Entrenador", "Suspendido"],
      where: { id_Entrenador: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "Equipo no encontrado" });
      return;
    }
    item.Suspendido = req.body.Suspendido;
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
