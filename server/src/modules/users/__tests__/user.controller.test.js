import { jest } from '@jest/globals';

jest.mock('../user.model', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn()
}));

const User = require('../user.model');
const { getAllUsers, getUserById, updateUser } = require('../user.controller');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe("User Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    test("should fetch all users successfully", async () => {
      const mockQuery = { select: jest.fn().mockResolvedValue([{ name: "test" }]) };
      User.find.mockReturnValue(mockQuery);

      const req = {};
      const res = mockResponse();

      await getAllUsers(req, res);

      expect(User.find).toHaveBeenCalledWith({});
      expect(mockQuery.select).toHaveBeenCalledWith('-password');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, count: 1, data: [{ name: "test" }] });
    });

    test("should return 500 on error", async () => {
      User.find.mockImplementation(() => { throw new Error("DB Error") });

      const req = {};
      const res = mockResponse();

      await getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getUserById", () => {
    test("should fetch user by ID successfully", async () => {
      const mockQuery = { select: jest.fn().mockResolvedValue({ name: "test" }) };
      User.findById.mockReturnValue(mockQuery);

      const req = { params: { id: "1" } };
      const res = mockResponse();

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should return 404 if user not found", async () => {
      const mockQuery = { select: jest.fn().mockResolvedValue(null) };
      User.findById.mockReturnValue(mockQuery);

      const req = { params: { id: "1" } };
      const res = mockResponse();

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("updateUser", () => {
    test("should update user successfully", async () => {
      const mockQuery = { select: jest.fn().mockResolvedValue({ name: "updated" }) };
      User.findByIdAndUpdate.mockReturnValue(mockQuery);

      const req = { params: { id: "1" }, body: { name: "updated" } };
      const res = mockResponse();

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should return 404 if user not found for update", async () => {
      const mockQuery = { select: jest.fn().mockResolvedValue(null) };
      User.findByIdAndUpdate.mockReturnValue(mockQuery);

      const req = { params: { id: "1" }, body: { name: "updated" } };
      const res = mockResponse();

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
