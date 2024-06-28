const express = require('express');
const router = express.Router();

let arr_PosicionesMock = [
  {
    "IdPosicion": 1,
    "Nombre": "Arquero"
  },
  {
    "IdPosicion": 2,
    "Nombre": "Defensor Central"
  },
  {
    "IdPosicion": 3,
    "Nombre": "Lateral Izquierdo"
  },
  {
    "IdPosicion": 4,
    "Nombre": "Lateral Derecho"
  },
  {
    "IdPosicion": 5,
    "Nombre": "Mediocampista Defensivo"
  },
  {
    "IdPosicion": 6,
    "Nombre": "Mediocampista"
  },
  {
    "IdPosicion": 7,
    "Nombre": "Mediocampista Ofensivo"
  },
  {
    "IdPosicion": 8,
    "Nombre": "Extremo Izquierdo"
  },
  {
    "IdPosicion": 9,
    "Nombre": "Extremo Derecho"
  },
  {
    "IdPosicion": 10,
    "Nombre": "Delantero Central"
  }
]
;

router.get('/api/posicionesmock', async function (req, res) {
  res.json(arr_PosicionesMock);
});

router.get('/api/posicionesmock/:id', async function (req, res) {
  let posicion = arr_PosicionesMock.find(
    (x) => x.IdPosicion == req.params.id
  );
  if (posicion) res.json(posicion);
  else res.status(404).json({ message: 'posicion no encontrada' });
});

router.post('/api/posicionesmock/', (req, res) => {
  const { Nombre } = req.body;
  let posicion = {
    Nombre,
    IdPosicion: Math.floor(Math.random()*100000),
  };

  // aqui agregar a la coleccion
  arr_PosicionesMock.push(posicion);

  res.status(201).json(posicion);
});

router.put('/api/posicionmock/:id', (req, res) => {
  let posicion = arr_PosicionesMock.find(
    (x) => x.IdPosicion == req.params.id
  );

  if (posicion) {
    const { Nombre } = req.body;
    posicion.Nombre = Nombre;
    res.json({ message: 'posicion actualizado' });
  } else {
    res.status(404).json({ message: 'posicion no encontrado' })
  }
});

router.delete('/api/posicionesmock/:id', (req, res) => {
  let posicion = arr_PosicionesMock.find(
    (x) => x.IdPosicion == req.params.id
  );

  if (possicion) {
    arr_PosicionMock = arr_PosicionMock.filter(
      (x) => x.IdPosicion != req.params.id
    );
    res.json({ message: 'posicion eliminado' });
  } else {
    res.status(404).json({ message: 'posicion no encontrado' })
  }
});


module.exports = router;
