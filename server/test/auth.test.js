const { isAuthenticated, hasAdminRole } = require("../middleware/auth");
const jwt = require("jsonwebtoken");

describe("Auth Middleware Tests", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {},
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("isAuthenticated Middleware", () => {
    it("should skip authentication in test environment", () => {
      process.env.NODE_ENV = "test";
      isAuthenticated(req, res, next);
      expect(req.user).toEqual({ id: 1, role: "Admin" });
      expect(next).toHaveBeenCalled();
    });

    it("should return 401 if no token is provided", () => {
      process.env.NODE_ENV = "development";
      isAuthenticated(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Access Denied: No token provided.",
      });
    });

    it("should return 403 if the token is invalid or expired", () => {
      process.env.NODE_ENV = "development";
      req.cookies.token = "invalid-token";

      jest.spyOn(jwt, "verify").mockImplementation((token, secret, callback) => {
        callback(new Error("Invalid or expired token"), null);
      });

      isAuthenticated(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid or expired token.",
      });
    });

    it("should call next if the token is valid", () => {
      process.env.NODE_ENV = "development";
      req.cookies.token = "valid-token";

      jest.spyOn(jwt, "verify").mockImplementation((token, secret, callback) => {
        callback(null, { id: 1, role: "User" });
      });

      isAuthenticated(req, res, next);

      expect(req.user).toEqual({ id: 1, role: "User" });
      expect(next).toHaveBeenCalled();
    });
  });

  describe("hasAdminRole Middleware", () => {
    it("should call next if the user has Admin role", () => {
      req.user = { id: 1, role: "Admin" };
      hasAdminRole(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("should return 403 if the user is not an Admin", () => {
      req.user = { id: 2, role: "User" };
      hasAdminRole(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Access Denied: Admins only.",
      });
    });

    it("should return 403 if the user object is missing", () => {
      req.user = null;
      hasAdminRole(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Access Denied: Admins only.",
      });
    });
  });
});
