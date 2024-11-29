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

describe("PUT /update-drama", () => {
  const validData = {
    id: 1,
    imdb_score: 8.5,
    status: "available",
    view: 2000,
    title: "Updated Test Movie",
    alt_title: "Updated Alternative Title",
    director: "Updated Director",
    release_year: 2023,
    country: ["USA", "Canada"],
    synopsis: "This is an updated synopsis",
    availability: "Netflix",
    trailer: "https://updated-trailer.url",
    posterUrl: "https://updated-poster.url",
    backgroundUrl: "https://updated-background.url",
    genres: ["Drama", "Thriller"],
    actors: [{ name: "Updated Actor", role: "Lead" }],
    awards: ["Updated Award"],
  };

//   afterAll(async () => {
//     server.close(); // Tutup server setelah testing selesai
//     await db.end(); // Tutup koneksi database
//   });

  test("should successfully update an existing movie", async () => {
    const response = await request.put("/update-drama").send(validData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Drama updated successfully");
    expect(response.body).toHaveProperty("movieId", validData.id);
  });

  test("should return 404 if the movie does not exist", async () => {
    const invalidData = { ...validData, id: 9999 }; // ID yang tidak ada

    const response = await request.put("/update-drama").send(invalidData);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "Movie not found");
  });

  test("should return 500 if required fields are missing", async () => {
    const invalidData = { ...validData };
    delete invalidData.title; // Hapus field `title`

    const response = await request.put("/update-drama").send(invalidData);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("error", "Internal Server Error");
  });
});
