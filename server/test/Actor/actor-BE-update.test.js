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

describe("PUT /actors/:id", () => {
    const validData = {
        name: "Muhammad Azhar",
        birthdate: "2003-09-27",
        country_name: "Indonesia",
        actor_picture: "https://akademik.polban.ac.id/fotomhsrekap/221524018.jpg",
    };

    test("should successfully edit an actor", async () => {
        const response = await request.put("/actors/1").send(validData);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "Actor updated successfully.");
        expect(response.body).toHaveProperty("actorID", "1");
    });

    test("should return 400 if required fields are missing", async () => {
        const invalidData = { ...validData };
        delete invalidData.name; // Hapus field `name`

        const response = await request.put("/actors/1").send(invalidData);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error", "Missing required fields.");
    });

    test("should return 400 if country is not found", async () => {
        const invalidCountryData = { ...validData, country_name: "Unknown Country" };

        const response = await request.put("/actors/1").send(invalidCountryData);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty(
            "error",
            "Country does not exist."
        );
    });


    test("should return 404 if actor ID does not exist", async () => {
        const response = await request.put("/actors/9999").send(validData);

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("error", "Actor not found.");
    });
});