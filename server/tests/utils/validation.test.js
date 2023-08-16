const Validator = require("validator");
const assert = require("assert");

const {
  validateUserSignup,
  validateLoginInput,
  loginIdInUse,
  emailInUse,
} = require("../../utils/validation");

describe("validateUserSignup", () => {
  let data;

  beforeEach(() => {
    data = {
      email: "test@example.com",
      password: "password",
      passwordVerification: "password",
      loginId: "testlogin",
      fullName: "Test User",
    };
  });

  it("should return an object with errors and isValid properties", () => {
    const result = validateUserSignup(data);
    assert.strictEqual(typeof result, "object");
    assert.strictEqual(typeof result.errors, "object");
    assert.strictEqual(typeof result.isValid, "boolean");
  });

  it("should return isValid as true when there are no errors", () => {
    const result = validateUserSignup(data);
    assert.strictEqual(result.isValid, true);
  });

  it("should return an error if loginId is empty", () => {
    data.loginId = "";
    const result = validateUserSignup(data);
    assert.strictEqual(result.errors.loginId, "Login ID is required and must be " + process.env.USER_ID_MIN_LENGTH + " or more characters");
  });

  it("should return an error if loginId is shorter than USER_ID_MIN_LENGTH", () => {
    data.loginId = "abc";
    const result = validateUserSignup(data);
    assert.strictEqual(result.errors.loginId, "Login ID is required and must be " + process.env.USER_ID_MIN_LENGTH + " or more characters");
  });

  it("should return an error if email is empty", () => {
    data.email = "";
    const result = validateUserSignup(data);
    assert.strictEqual(result.errors.email, "Email field is required");
  });

  it("should return an error if email is invalid", () => {
    data.email = "invalidemail";
    const result = validateUserSignup(data);
    assert.strictEqual(result.errors.email, "Email is invalid");
  });

  it("should return an error if password is empty", () => {
    data.password = "";
    const result = validateUserSignup(data);
    assert.strictEqual(result.errors.password, "Password field is required and must be " + process.env.PASSWORD_MIN_LENGTH + " or more characters");
  });

  it("should return an error if password is shorter than PASSWORD_MIN_LENGTH", () => {
    data.password = "abc";
    const result = validateUserSignup(data);
    assert.strictEqual(result.errors.password, "Password field is required and must be " + process.env.PASSWORD_MIN_LENGTH + " or more characters");
  });

  it("should return an error if passwordVerification does not match password", () => {
    data.passwordVerification = "differentpassword";
    const result = validateUserSignup(data);
    assert.strictEqual(result.errors.passwordVerification, "Passwords do not match");
  });
});

describe("validateLoginInput", () => {
  let data;

  beforeEach(() => {
    data = {
      loginId: "testlogin",
      password: "password",
    };
  });

  it("should return an object with errors and isValid properties", () => {
    const result = validateLoginInput(data);
    assert.strictEqual(typeof result, "object");
    assert.strictEqual(typeof result.errors, "object");
    assert.strictEqual(typeof result.isValid, "boolean");
  });

  it("should return isValid as true when there are no errors", () => {
    const result = validateLoginInput(data);
    assert.strictEqual(result.isValid, true);
  });

  it("should return an error if loginId is empty", () => {
    data.loginId = "";
    const result = validateLoginInput(data);
    assert.strictEqual(result.errors.loginId, "Login ID is required");
  });
}); 
