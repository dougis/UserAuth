const jwt = require("jsonwebtoken");
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const isEmpty = require("is-empty");
const validation = require("../../utils/validation"); // import the validation module
const assert = require("assert");
const User = require("../../models/User");
const {
  createUser,
  confirmUserLogin,
  createLoginTokenAndLogin,
} = require("../../utils/user_auth"); // import the
// Please note that you will need to import other necessary dependencies/mock data for successful testing

// Tests for the createUser function
describe("createUser", () => {
  let validateUserSignupStub;
  let saveStub;

  beforeEach(() => {
    validateUserSignupStub = sinon.stub(validation, "validateUserSignup");
    saveStub = sinon.stub(User.prototype, "save");
  });

  afterEach(() => {
    validateUserSignupStub.restore();
    saveStub.restore();
  });

  it("should return errors and isValid flag false if validation fails", async () => {
    validateUserSignupStub.resolves({
      errors: "validation errors",
      isValid: false,
    });

    const result = await createUser({});
    assert.strictEqual(result.errors, "validation errors");
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.newUser, null);
  });

  it("should create a new user if validation passes", async () => {
    validateUserSignupStub.resolves({ errors: null, isValid: true });
    saveStub.resolves();

    const result = await createUser({
      loginId: "john",
      fullName: "John Doe",
      email: "john.doe@example.com",
      password: "password",
    });
    assert.strictEqual(saveStub.calledOnce, true);
    expect(result.newUser).toEqual(
      expect.objectContaining({
        loginId: "john",
        fullName: "John Doe",
        email: "john.doe@example.com",
      })
    );
    assert.deepEqual(result.createErrors, {});
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(typeof result.newUser, "object");
  });
});

// Tests for the confirmUserLogin function
describe("confirmUserLogin", () => {
  it("should return errors and isValid=false if login input is invalid", async () => {
    const data = {}; // Replace with invalid test data
    const result = await confirmUserLogin(data);
    expect(result.errors).toBeDefined();
    expect(result.isValid).toBe(false);
    expect(result.user).toBeNull();
  });

  it("should return authErrors and isValid=false if user does not exist or password is incorrect", async () => {
    const data = {}; // Replace with valid test data
    const result = await confirmUserLogin(data);
    expect(result.authErrors).toBeDefined();
    expect(result.isValid).toBe(false);
    expect(result.user).toBeNull();
  });

  it("should return authErrors as empty and isValid=true if user login is successful", async () => {
    const data = {}; // Replace with valid test data
    const result = await confirmUserLogin(data);
    expect(result.authErrors).toEqual({});
    expect(result.isValid).toBe(true);
    expect(result.user).toBeInstanceOf(User);
  });
});

// Tests for the createLoginTokenAndLogin function
describe("createLoginTokenAndLogin", () => {
  // Please note that you will need to mock the necessary dependencies/responses to test this function
  it("should create access token and return success response with token and user information", () => {
    const user = {}; // Replace with valid user object
    const res = {}; // Replace with valid response object

    const spyVerify = jest.spyOn(jwt, "verify");
    spyVerify.mockImplementation((_, __, callback) => {
      callback(null, { decoded: true });
    });

    createLoginTokenAndLogin(user, res);

    expect(spyVerify).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      token: expect.any(String),
      message: user,
    });

    spyVerify.mockRestore();
  });

  it("should handle JWT verification error and return error response", () => {
    const user = {}; // Replace with valid user object
    const res = {}; // Replace with valid response object

    const spyVerify = jest.spyOn(jwt, "verify");
    spyVerify.mockImplementation((_, __, callback) => {
      callback(new Error("Verification error"));
    });

    createLoginTokenAndLogin(user, res);

    expect(spyVerify).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ errors: expect.any(Error) });

    spyVerify.mockRestore();
  });

  it("should handle JWT decoding error and return error response", () => {
    const user = {}; // Replace with valid user object
    const res = {}; // Replace with valid response object

    const spyVerify = jest.spyOn(jwt, "verify");
    spyVerify.mockRejectedValue(new Error("Decoding error"));

    createLoginTokenAndLogin(user, res);

    expect(spyVerify).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ errors: expect.any(Error) });

    spyVerify.mockRestore();
  });
});
