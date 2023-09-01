const sinon = require("sinon");
const validation = require("../../utils/validation"); // import the validation module
const assert = require("assert");
const User = require("../../models/User");
const { createUser } = require("../../utils/user_auth"); // import the createUser function

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
