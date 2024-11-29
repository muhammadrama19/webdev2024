const { app, server, db } = require("../index");
const supertest = require("supertest");
const request = supertest(app);

jest.mock("bcrypt", () => ({
  compare: jest.fn((password, hash, callback) => {
    if (password === "correct_password") callback(null, true);
    else callback(null, false);
  }),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked_jwt_token"),
}));

describe("POST /login", () => {
  const userIds = []; // Simpan semua ID yang digunakan untuk dihapus setelahnya

  afterAll(async () => {
    if (server) server.close(); // Tutup server setelah semua tes selesai
    if (db) await db.end(); // Tutup koneksi database
  });

  afterEach(async () => {
    // Bersihkan data terkait di tabel `reviews`
    if (userIds.length > 0) {
      await db.promise().query("DELETE FROM reviews WHERE user_id IN (?)", [userIds]);
      // Hapus data di tabel `users`
      await db.promise().query("DELETE FROM users WHERE id IN (?)", [userIds]);
      userIds.length = 0; // Reset array userIds
    }
  });

  test("should successfully log in a valid user", async () => {
    const mockUser = {
      id: 301,
      username: "TestUser",
      email: "testuser@example.com",
      role: "User",
      password: "$2b$10$hashedpassword",
      Status_Account: 1,
      isEmailConfirmed: true,
      googleId: null,
    };

    userIds.push(mockUser.id);
    await db
      .promise()
      .query(
        "INSERT INTO users (id, username, email, role, password, Status_Account, isEmailConfirmed, googleId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          mockUser.id,
          mockUser.username,
          mockUser.email,
          mockUser.role,
          mockUser.password,
          mockUser.Status_Account,
          mockUser.isEmailConfirmed,
          mockUser.googleId,
        ]
      );

    const response = await request.post("/login").send({
      email: mockUser.email,
      password: "correct_password",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("Status", "Login Success");
    expect(response.body).toHaveProperty("token", "mocked_jwt_token");
  });

  test("should return an error for incorrect password", async () => {
    const mockUser = {
      id: 302,
      username: "WrongPasswordUser",
      email: "wrongpassword@example.com",
      role: "User",
      password: "$2b$10$hashedpassword",
      Status_Account: 1,
      isEmailConfirmed: true,
      googleId: null,
    };

    userIds.push(mockUser.id);
    await db
      .promise()
      .query(
        "INSERT INTO users (id, username, email, role, password, Status_Account, isEmailConfirmed, googleId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          mockUser.id,
          mockUser.username,
          mockUser.email,
          mockUser.role,
          mockUser.password,
          mockUser.Status_Account,
          mockUser.isEmailConfirmed,
          mockUser.googleId,
        ]
      );

    const response = await request.post("/login").send({
      email: mockUser.email,
      password: "wrong_password",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("Message", "Incorrect Password");
  });

  test("should return an error for unconfirmed email", async () => {
    const mockUser = {
      id: 303,
      username: "UnconfirmedUser",
      email: "unconfirmed@example.com",
      role: "User",
      password: "$2b$10$hashedpassword",
      Status_Account: 1,
      isEmailConfirmed: false,
      googleId: null,
    };

    userIds.push(mockUser.id);
    await db
      .promise()
      .query(
        "INSERT INTO users (id, username, email, role, password, Status_Account, isEmailConfirmed, googleId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          mockUser.id,
          mockUser.username,
          mockUser.email,
          mockUser.role,
          mockUser.password,
          mockUser.Status_Account,
          mockUser.isEmailConfirmed,
          mockUser.googleId,
        ]
      );

    const response = await request.post("/login").send({
      email: mockUser.email,
      password: "correct_password",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("Message", "Please confirm your email first.");
  });

  test("should return an error if the account is suspended", async () => {
    const mockUser = {
      id: 304,
      username: "SuspendedUser",
      email: "suspended@example.com",
      role: "User",
      password: "$2b$10$hashedpassword",
      Status_Account: 2,
      isEmailConfirmed: true,
      googleId: null,
    };

    userIds.push(mockUser.id);
    await db
      .promise()
      .query(
        "INSERT INTO users (id, username, email, role, password, Status_Account, isEmailConfirmed, googleId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          mockUser.id,
          mockUser.username,
          mockUser.email,
          mockUser.role,
          mockUser.password,
          mockUser.Status_Account,
          mockUser.isEmailConfirmed,
          mockUser.googleId,
        ]
      );

    const response = await request.post("/login").send({
      email: mockUser.email,
      password: "correct_password",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("Status", "Account Suspended");
  });
});
