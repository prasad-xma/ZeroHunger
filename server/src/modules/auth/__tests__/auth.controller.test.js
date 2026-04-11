import { jest } from '@jest/globals';

jest.mock('../../users/user.model', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  countDocuments: jest.fn(),
}));

jest.mock('../../../utils/authUtils/passwordUtils', () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}));

jest.mock('../../../utils/authUtils/tokenUtils', () => ({
  generateToken: jest.fn(),
  verifyJwtToken: jest.fn(),
}));

const User = require('../../users/user.model');
const { hashPassword, comparePassword } = require('../../../utils/authUtils/passwordUtils');
const { generateToken, verifyJwtToken } = require('../../../utils/authUtils/tokenUtils');

const { register, login, logout } = require('../auth.controller');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  res.clearCookie = jest.fn();
  return res;
};

describe("Auth Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return error if passwords do not match", async () => {
    const req = {
      body: { email: "test@mail.com", password: "123", confirmPassword: "456" }
    };
    const res = mockResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Passwords do not match" });
  });

  test("should return error if user already exists", async () => {
    User.findOne.mockResolvedValue({ email: "test@mail.com" });

    const req = {
      body: { email: "test@mail.com", password: "123", confirmPassword: "123" }
    };
    const res = mockResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
  });

  test("should register user successfully", async () => {
    User.findOne.mockResolvedValue(null);
    User.countDocuments.mockResolvedValue(1);
    hashPassword.mockResolvedValue("hashed123");
    User.create.mockResolvedValue({ email: "test@mail.com" });

    const req = {
      body: {
        email: "test@mail.com",
        password: "123",
        confirmPassword: "123",
        role: "user"
      }
    };
    const res = mockResponse();

    await register(req, res);

    expect(hashPassword).toHaveBeenCalledWith("123");
    expect(User.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("should return error if email or password missing", async () => {
    const req = { body: { email: "", password: "" } };
    const res = mockResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return error if user not found", async () => {
    User.findOne.mockResolvedValue(null);

    const req = { body: { email: "test@mail.com", password: "123" } };
    const res = mockResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return error if password incorrect", async () => {
    User.findOne.mockResolvedValue({ password: "hashed" });
    comparePassword.mockResolvedValue(false);

    const req = { body: { email: "test@mail.com", password: "wrong" } };
    const res = mockResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should login successfully", async () => {
    User.findOne.mockResolvedValue({ _id: "1", role: "user", password: "hashed" });
    comparePassword.mockResolvedValue(true);
    generateToken.mockReturnValue("fake-token");

    const req = { body: { email: "test@mail.com", password: "123" } };
    const res = mockResponse();

    await login(req, res);

    expect(generateToken).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User logged in successfully",
      token: "fake-token"
    });
  });

  test("should logout successfully", async () => {
    verifyJwtToken.mockReturnValue({ userId: "1" });

    const req = {
      headers: {
        authorization: "Bearer faketoken"
      }
    };
    const res = mockResponse();

    await logout(req, res);

    expect(res.clearCookie).toHaveBeenCalledWith("token", { httpOnly: true });
    expect(res.status).toHaveBeenCalledWith(200);
  });

});
