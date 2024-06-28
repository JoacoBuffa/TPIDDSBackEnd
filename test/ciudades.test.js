const request = require("supertest");
const app = require("../index");

describe("GET /api/ciudades", function () {
  it("Devolvería todas las ciudades", async function () {
    const res = await request(app)
      .get("/api/ciudades")
      .set("content-type", "application/json");
    expect(res.headers["content-type"]).toEqual(
      "application/json; charset=utf-8"
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          idCiudad: expect.any(Number),
          nombreCiudad: expect.any(String),
        }),
      ])
    );
  });
});

describe("GET /api/ciudades/:id", function () {
  it("Devolvería una ciudad específica por ID", async function () {
    const res = await request(app)
      .get("/api/ciudades/1")
      .set("content-type", "application/json");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        idCiudad: 1,
        nombreCiudad: expect.any(String),
      })
    );
  });

  it("Devolvería un 404 si la ciudad no existe", async function () {
    const res = await request(app)
      .get("/api/ciudades/999")
      .set("content-type", "application/json");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        mensaje: "No encontrado!!",
      })
    );
  });
});
