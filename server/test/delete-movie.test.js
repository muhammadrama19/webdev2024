const { app, server, db } = require("../index");
const supertest = require("supertest");
const request = supertest(app);

// Mock middleware
jest.mock("../middleware/auth.js", () => ({
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

describe("PUT /movie-delete/:id", () => {
//   afterAll(async () => {
//     server.close(); // Tutup server setelah testing selesai
//     await db.end(); // Tutup koneksi database
//   });

  test("should successfully move movie to trash", async () => {
    // Mock movie ID yang valid
    const validMovieId = 1;

    // Kirim request ke endpoint
    const response = await request.put(`/movie-delete/${validMovieId}`);

    // Validasi respons
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Movie moved to trash successfully"
    );
  });

  test("should return 404 if the movie ID does not exist", async () => {
    // Mock movie ID yang tidak ada
    const nonExistentMovieId = 9999;

    // Kirim request ke endpoint
    const response = await request.put(`/movie-delete/${nonExistentMovieId}`);

    // Validasi respons
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "Movie not found");
  });

  test("should return 500 if there is an internal server error", async () => {
    // Simulasikan ID film tidak valid untuk memicu error
    const invalidMovieId = "invalid";

    // Kirim request ke endpoint
    const response = await request.put(`/movie-delete/${invalidMovieId}`);

    // Validasi respons
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("error", "Internal Server Error");
  });
});
