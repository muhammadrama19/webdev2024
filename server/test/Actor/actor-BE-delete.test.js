const { app, server, db } = require("../../index");
const supertest = require("supertest");
const request = supertest(app);

// Mock middleware
jest.mock("../../middleware/auth.js", () => ({
  isAuthenticated: (req, res, next) => {
    req.user = { id: 1, role: "Admin" }; // Mock user valid
    next();
  },
  hasAdminRole: (req, res, next) => {
    if (req.user.role === "Admin") {
      next();
    } else {
      res.status(403).json({ error: "Access Denied: Admins only." });
    }
  },
}));

describe("PUT /actors/delete/:id", () => {

  test("should successfully delete an actor", async () => {
    // Mock actor ID yang valid
    const validActorId = 3669;

    // Kirim request ke endpoint
    const response = await request.put(`/actors/delete/${validActorId}`);

    // Validasi respons
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Actor deleted successfully.");
  });

  test("should return 400 if the actor is still associated with a movie", async () => {
    // Mock actor ID yang masih terkait dengan film
    const actorIdWithMovie = 1;

    // Kirim request ke endpoint
    const response = await request.put(`/actors/delete/${actorIdWithMovie}`);

    // Validasi respons
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Cannot delete actor, it is still referenced in movie_actor."
    );
  });

  test("should return 404 if the actor ID does not exist", async () => {
    // Mock actor ID yang tidak ada
    const nonExistentActorId = 9999;

    // Kirim request ke endpoint
    const response = await request.put(`/actors/delete/${nonExistentActorId}`);

    // Validasi respons
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "Actor not found.");
  });
});