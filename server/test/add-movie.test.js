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

describe("POST /add-drama", () => {
    const validData = {
        imdb_score: 8.5,
        status: "available",
        view: 1000,
        title: "Test Movie",
        alt_title: "Alternative Title",
        director: "Test Director",
        release_year: 2023,
        country: ["USA"],
        synopsis: "This is a test synopsis",
        availability: "Netflix",
        trailer: "https://trailer.url",
        posterUrl: "https://poster.url",
        backgroundUrl: "https://background.url",
        genres: ["Action", "Comedy"],
        actors: [{ name: "Test Actor", role: "Lead" }],
        awards: ["Oscar"],
    };

    // afterAll(async () => {
    //     server.close(); // Tutup server setelah testing selesai
    //     await db.end(); // Tutup koneksi database
    // });

    test("should successfully add a new movie", async () => {
        const response = await request.post("/add-drama").send(validData);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "Drama added successfully");
        expect(response.body).toHaveProperty("movieId");
    });

    test("should return 500 if required fields are missing", async () => {
        const invalidData = { ...validData };
        delete invalidData.title; // Hapus field `title`

        const response = await request.post("/add-drama").send(invalidData);

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty("error", "Internal Server Error");
    });
});
