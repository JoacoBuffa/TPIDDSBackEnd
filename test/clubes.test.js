const request = require("supertest");
const app = require("../index");

const clubAlta = {
  nombreClub: "Club " + (() => (Math.random() + 1).toString(36).substring(2))(), // Genera un nombre aleatorio
  fechaCreacion: new Date().toISOString(),
  torneosGanados: 5,
  activo: true,
  idCiudad: 1,
};

const clubModificacion = {
  nombreClub:
    "Club Modificado " +
    (() => (Math.random() + 1).toString(36).substring(2))(),
  fechaCreacion: new Date().toISOString(),
  torneosGanados: 10,
  activo: false,
  idCiudad: 2,
};

// test route/clubes GET
describe("GET /api/clubes", () => {
  it("Debería devolver todos los clubes", async () => {
    const res = await request(app).get("/api/clubes");
    expect(res.statusCode).toEqual(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        Items: expect.arrayContaining([
          expect.objectContaining({
            idClub: expect.any(Number),
            nombreClub: expect.any(String),
            fechaCreacion: expect.any(String),
            torneosGanados: expect.any(Number),
            activo: expect.any(Boolean),
            idCiudad: expect.any(Number),
          }),
        ]),
        RegistrosTotal: expect.any(Number),
      })
    );
  });
});

// test route/clubes GET con filtros
describe("GET /api/clubes con filtros", () => {
  it("Debería devolver los clubes según filtro", async () => {
    const res = await request(app).get(
      "/api/clubes?nombreClub=Real&activo=true&Pagina=1"
    );
    expect(res.statusCode).toEqual(200);

    expect(verificarPropiedades(res.body.Items)).toEqual(true);

    function verificarPropiedades(array) {
      for (let i = 0; i < array.length; i++) {
        if (!array[i].nombreClub.includes("Real") || !array[i].activo) {
          return false;
        }
      }
      return true;
    }
  });
});

// test route/clubes/:id GET
describe("GET /api/clubes/:id", () => {
  it("Debería devolver el club con el id 1", async () => {
    const res = await request(app).get("/api/clubes/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        idClub: expect.any(Number),
        nombreClub: expect.any(String),
        fechaCreacion: expect.any(String),
        torneosGanados: expect.any(Number),
        activo: expect.any(Boolean),
        idCiudad: expect.any(Number),
      })
    );
  });
});

// test route/clubes POST
describe("POST /api/clubes", () => {
  it("Debería devolver el club que acabo de crear", async () => {
    const res = await request(app).post("/api/clubes").send(clubAlta);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        idClub: expect.any(Number),
        nombreClub: expect.any(String),
        fechaCreacion: expect.any(String),
        torneosGanados: expect.any(Number),
        activo: expect.any(Boolean),
        idCiudad: expect.any(Number),
      })
    );
  });
});

// test route/clubes/:id PUT
describe("PUT /api/clubes/:id", () => {
  it("Debería devolver el club con el id 3 modificado", async () => {
    const res = await request(app).put("/api/clubes/3").send(clubModificacion);
    expect(res.statusCode).toEqual(204);
  });
});

// test route/clubes/:id DELETE
describe("DELETE /api/clubes/:id", () => {
  it("Debería devolver el club con el id 4 borrado", async () => {
    const res = await request(app).delete("/api/clubes/4");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "club eliminado correctamente",
      })
    );
  });
});

// test route/clubes/suspender/:id PUT
describe("PUT /api/clubes/suspender/:id", () => {
  it("Debería suspender el club con el id 2", async () => {
    const res = await request(app)
      .put("/api/clubes/suspender/2")
      .send({ activo: false });
    expect(res.statusCode).toEqual(204);
  });
});
