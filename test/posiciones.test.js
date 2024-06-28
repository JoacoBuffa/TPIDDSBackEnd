const request = require("supertest");
const app = require("../index");

describe("GET /api/posiciones", function () {
  it("Devolveria todos los posiciones", async function () {
    const res = await request(app)
      .get("/api/posiciones")
      .set("content-type", "application/json");
    expect(res.headers["content-type"]).toEqual(
      "application/json; charset=utf-8"
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          IdPosicion: expect.any(Number),
          Nombre: expect.any(String),
        }),
      ])
    );
  });
});


describe("GET /api/posiciones/:id", function () {
  it("respond with json containing a single posiciones", async function () {
    const res = await request(app)
      .get("/api/posiciones/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdPosicion: 1,
        Nombre: expect.any(String),
      })
    );
  });
});
