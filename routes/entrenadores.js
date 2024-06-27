const express = require("express");
const router = express.Router();
const db = require("../base-orm/sequelize-init");
const { Op, ValidationError } = require("sequelize");
const auth = require("../seguridad/auth");

router.get("/api/entrenadores", async function (req, res, next) {
  // #swagger.tags = ['Articulos']
  // #swagger.summary = 'obtiene todos los Articulos'
  // consulta de artículos con filtros y paginacion

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
});

router.get("/api/entrenadores/:id", async function (req, res, next) {
  // #swagger.tags = ['Articulos']
  // #swagger.summary = 'obtiene un Articulo'
  // #swagger.parameters['id'] = { description: 'identificador del Articulo...' }
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

router.post("/api/entrenadores/", async (req, res) => {
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

router.put("/api/entrenadores/:id", async (req, res) => {
  // #swagger.tags = ['Articulos']
  // #swagger.summary = 'actualiza un Artículo'
  // #swagger.parameters['id'] = { description: 'identificador del Artículo...' }
  /*    #swagger.parameters['Articulo'] = {
                in: 'body',
                description: 'Articulo a actualizar',
                schema: { $ref: '#/definitions/Articulos' }
    } */

  try {
    let item = await db.entrenadores.findOne({
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
    item.Activo = req.body.Activo;

    await item.save();

    // otra forma de hacerlo
    // let data = await db.articulos.update(
    //   {
    //     Nombre: req.body.Nombre,
    //     Precio: req.body.Precio,
    //     CodigoDeBarra: req.body.CodigoDeBarra,
    //     IdArticuloFamilia: req.body.IdArticuloFamilia,
    //     Stock: req.body.Stock,
    //     FechaAlta: req.body.FechaAlta,
    //     Activo: req.body.Activo,
    //   },
    //   { where: { IdArticulo: req.params.id } }
    // );
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

router.delete("/api/entrenadores/:id", async (req, res) => {
  // #swagger.tags = ['Articulos']
  // #swagger.summary = 'elimina un Articulo'
  // #swagger.parameters['id'] = { description: 'identificador del Articulo..' }

  let bajaFisica = false;

  if (bajaFisica) {
    // baja fisica
    let filasBorradas = await db.entrenadores.destroy({
      where: { id_Entrenador: req.params.id },
    });
    if (filasBorradas == 1) res.sendStatus(200);
    else res.sendStatus(404);
  } else {
    // baja lógica
    try {
      let data = await db.sequelize.query(
        "UPDATE entrenadores SET Activo = case when Activo = 1 then 0 else 1 end WHERE id_Entrenador = :id_Entrenador",
        {
          replacements: { id_Entrenador: +req.params.id },
        }
      );
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ValidationError) {
        // si son errores de validación, los devolvemos
        const messages = err.errors.map((x) => x.message);
        res.status(400).json(messages);
      } else {
        // si son errores desconocidos, los dejamos que los controle el middleware de errores
        throw err;
      }
    }
  }
});

//------------------------------------
//-- SEGURIDAD ---------------------------
//------------------------------------

module.exports = router;
