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

describe("POST /actors", () => {
    const validData = {
        name: "Muhammad Azhar",
        birthdate: "27/09/2003",
        country_name: "Indonesia",
        actor_picture: "https://akademik.polban.ac.id/fotomhsrekap/221524018.jpg",
    };

    test("should successfully add a new actor", async () => {
        const response = await request.post("/actors").send(validData);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("message", "Actor added successfully.");
        expect(response.body).toHaveProperty("id");
    });

    test("should return 500 if required fields are missing", async () => {
        const invalidData = { ...validData };
        delete invalidData.name; // Hapus field `name`

        const response = await request.post("/actors").send(invalidData);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error", "Missing required fields.");
    });

    test("should return 400 if country is not found", async () => {
        const invalidCountryData = { ...validData, country_name: "Unknown Country" };

        const response = await request.post("/actors").send(invalidCountryData);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty(
            "error",
            "Country not found. Please add the country first."
        );
    });
});
