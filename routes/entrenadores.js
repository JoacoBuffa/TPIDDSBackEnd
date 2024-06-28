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
    if (req.query.Activo != undefined && req.query.Activo !== "") {
      // true o false en el modelo, en base de datos es 1 o 0
      // convertir el string a booleano
      where.Activo = req.query.Activo === "true";
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
        "Activo",
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
  let items = await db.entrenadores.findOne({
    attributes: [
      "id_Entrenador",
      "nombreEntrenador",
      "fechaNacimiento",
      "añosExperiencia",
      "id_tipoEntrenador",
      "tieneClub",
      "clubActual",
      "Activo",
    ],
    where: { id_Entrenador: req.params.id },
  });
  res.json(items);
});

// Crear un nuevo empleado
// post d articulos modificado
router.post("/api/entrenadores", async (req, res) => {
  try {
    let data = await db.entrenadores.create({
      nombreEntrenador: req.body.nombreEntrenador,
      fechaNacimiento: req.body.fechaNacimiento,
      añosExperiencia: req.body.añosExperiencia,
      id_tipoEntrenador: req.body.id_tipoEntrenador,
      tieneClub: req.body.tieneClub,
      clubActual: req.body.clubActual,
      Activo: req.body.Activo,
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
    const [numFilasActualizadas, entrenadorActualizado] =
      await db.entrenadores.update(req.body, {
        where: { id_Entrenador: req.params.id },
        returning: true,
      });
    if (entrenadorActualizado === 1) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: "Entrenador no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      attributes: ["id_Entrenador", "activo"],
      where: { id_Entrenador: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "Entrenador no encontrado" });
      return;
    }
    item.activo = req.body.activo;
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
