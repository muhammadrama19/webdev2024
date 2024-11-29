const { app, server, db } = require("../index");
const supertest = require("supertest");

jest.mock("passport", () => {
  const originalPassport = jest.requireActual("passport");
  return {
    ...originalPassport,
    use: jest.fn(),
    authenticate: jest.fn(() => (req, res, next) => {
      req.user = {
        id: 1,
        username: "GoogleUser",
        email: "googleuser@example.com",
        role: "User",
        Status_Account: 1, // Active account
      };
      next();
    }),
  };
});

describe("Google OAuth Login", () => {
  const userIds = [];

  afterAll(async () => {
    if (server) server.close(); // Tutup server setelah tes selesai
    if (db) await db.end(); // Tutup koneksi database
  });

  afterEach(async () => {
    if (userIds.length > 0) {
      await db.promise().query("DELETE FROM users WHERE id IN (?)", [userIds]);
      userIds.length = 0;
    }
  });

  test("should redirect to frontend with user details after successful login", async () => {
    const mockUser = {
      id: 501,
      username: "GoogleUser",
      email: "googleuser@example.com",
      role: "User",
      Status_Account: 1,
    };

    userIds.push(mockUser.id);

    await db.promise().query(
      "INSERT INTO users (id, username, email, role, Status_Account) VALUES (?, ?, ?, ?, ?)",
      [
        mockUser.id,
        mockUser.username,
        mockUser.email,
        mockUser.role,
        mockUser.Status_Account,
      ]
    );

    const response = await supertest(app).get("/auth/google/callback");

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toContain(
      `http://localhost:3001/?username=${mockUser.username}&email=${mockUser.email}&role=${mockUser.role}`
    );
  });

  test("should redirect to login with Account_Suspended error if account is suspended", async () => {
    const mockUser = {
      id: 502,
      username: "SuspendedGoogleUser",
      email: "suspendeduser@example.com",
      role: "User",
      Status_Account: 2,
    };

    userIds.push(mockUser.id);

    await db.promise().query(
      "INSERT INTO users (id, username, email, role, Status_Account) VALUES (?, ?, ?, ?, ?)",
      [
        mockUser.id,
        mockUser.username,
        mockUser.email,
        mockUser.role,
        mockUser.Status_Account,
      ]
    );

    const response = await supertest(app).get("/auth/google/callback");

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(
      "http://localhost:3001/login?error=Account_Suspended"
    );
  });

  test("should redirect to login with Account_Banned error if account is banned", async () => {
    const mockUser = {
      id: 503,
      username: "BannedGoogleUser",
      email: "banneduser@example.com",
      role: "User",
      Status_Account: 3,
    };

    userIds.push(mockUser.id);

    await db.promise().query(
      "INSERT INTO users (id, username, email, role, Status_Account) VALUES (?, ?, ?, ?, ?)",
      [
        mockUser.id,
        mockUser.username,
        mockUser.email,
        mockUser.role,
        mockUser.Status_Account,
      ]
    );

    const response = await supertest(app).get("/auth/google/callback");

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(
      "http://localhost:3001/login?error=Account_Banned"
    );
  });

  test("should redirect to login with error if Google authentication fails", async () => {
    const response = await supertest(app)
      .get("/auth/google/callback")
      .query({ error: "auth_failed" });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(
      "http://localhost:3001/login?error=google-auth-failed"
    );
  });
});
