const request = require("supertest");
const app = require("../index");
const jugadorAlta = {
  NombreApellido: "Zlatan Ibrahimovic",
  FechaNacimiento: "1993-01-18",
  Peso: 90,
  Altura: 2.8,
  Activo: 1,
  IdPosicion: 6,
};
const jugadorModificacion = {
  IdJugador: 3,
  NombreApellido: "Marcelo Gallardo",
  FechaNacimiento: "1986-10-27",
  Dni: 30000000,
  Activo: 0,
  Altura: 1.7,
  Peso: 78.8,
  IdPosicion: 3,
};

// test route/jugadores GET
describe("GET /api/jugadores", () => {
  it("Deberia devolver todos los jugadores", async () => {
    const res = await request(app).get("/api/jugadores");
    expect(res.statusCode).toEqual(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        Items: expect.arrayContaining([
          expect.objectContaining({
            IdJugador: expect.any(Number),
            NombreApellido: expect.any(String),
            FechaNacimiento: expect.any(String),
            Activo: expect.any(Boolean),
            Altura: expect.any(Number),
            Peso: expect.any(Number),
            IdPosicion: expect.any(Number),
          }),
        ]),
        RegistrosTotal: expect.any(Number),
      })
    );
  });
});

// test route/jugadores GET
describe("GET /api/jugadores con filtros", () => {
  it("Deberia devolver los jugadores según filtro ", async () => {
    const res = await request(app).get(
      "/api/jugadores?NombreApellido=AIRE&Activo=true&Pagina=1"
    );
    expect(res.statusCode).toEqual(200);

    expect(verificarPropiedades(res.body.Items)).toEqual(true);

    function verificarPropiedades(array) {
      for (let i = 0; i < array.length; i++) {
        if (!array[i].NombreApellido.includes("AIRE") || !array[i].Activo) {
          return false;
        }
      }
      return true;
    }
  });
});

// test route/jugadores/:id GET
describe("GET /api/jugadores/:id", () => {
  it("Deberia devolver el jugador con el id 1", async () => {
    const res = await request(app).get("/api/jugadores/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdJugador: expect.any(Number),
        NombreApellido: expect.any(String),
        FechaNacimiento: expect.any(String),
        Activo: expect.any(Boolean),
        Altura: expect.any(Number),
        Peso: expect.any(Number),
        IdPosicion: expect.any(Number),
      })
    );
  });
});

// test route/jugadores POST
describe("POST /api/jugadores", () => {
  it("Deberia devolver el jugador que acabo de crear", async () => {
    const res = await request(app).post("/api/jugadores").send(jugadorAlta);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdJugador: expect.any(Number),
        NombreApellido: expect.any(String),
        FechaNacimiento: expect.any(String),
        Activo: expect.any(Boolean),
        Altura: expect.any(Number),
        Peso: expect.any(Number),
        IdPosicion: expect.any(Number),
      })
    );
  });
});

// test route/jugadores/:id PUT
describe("PUT /api/jugadores/:id", () => {
  it("Deberia devolver el jugador con el id 1 modificado", async () => {
    const res = await request(app)
      .put("/api/jugadores/1")
      .send(jugadorModificacion);
    expect(res.statusCode).toEqual(204);
  });
});

// test route/jugadores/:id DELETE
describe("DELETE /api/jugadores/:id", () => {
  it("Debería devolver el jugador con el id 1 borrado", async () => {
    const res = await request(app).delete("/api/jugadores/1");
    expect(res.statusCode).toEqual(200);

    // baja lógica, no se borra realmente
    // expect(res.body).toEqual(
    //   expect.objectContaining({
    //     IdArticulo: expect.any(Number),
    //     Nombre: expect.any(String),
    //     Precio: expect.any(Number),
    //   })
    // );
  });
});
