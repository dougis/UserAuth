const Validator = require("validator");
const assert = require("assert");

const {
  validateUserSignup,
  validateLoginInput,
  loginIdInUse,
  emailInUse,
  userIdMinLength,
  passwordMinLength,
} = require("../../utils/validation");

describe("validateUserSignup", () => {
  let data;
  let validRequest;
  beforeEach(() => {
    data = {
      email: "test@example.com",
      password: "password",
      passwordVerification: "password",
      loginId: "testlogin",
      fullName: "Test User",
    };
    validRequest = true;
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
    validRequest = false;
    const expectedErrorObject = {
      loginId:
        "Login ID is required and must be " +
        userIdMinLength +
        " or more characters",
    };
    const { errors, isValid } = validateUserSignup(data);
    compareResultsToExpected(
      validRequest,
      expectedErrorObject,
      isValid,
      errors
    );
  });

  it("should return an error if loginId is shorter than USER_ID_MIN_LENGTH", () => {
    data.loginId = "abc";
    validRequest = false;
    const expectedErrorObject = {
      loginId:
        "Login ID is required and must be " +
        userIdMinLength +
        " or more characters",
    };
    const { errors, isValid } = validateUserSignup(data);
    compareResultsToExpected(
      validRequest,
      expectedErrorObject,
      isValid,
      errors
    );
  });

  it("should return an error if email is empty", () => {
    data.email = "";
    validRequest = false;
    const expectedErrorObject = {
      email: "Email field is required",
    };
    const { errors, isValid } = validateUserSignup(data);
    compareResultsToExpected(
      validRequest,
      expectedErrorObject,
      isValid,
      errors
    );
  });

  it("should return an error if email is invalid", () => {
    data.email = "invalidemail";
    validRequest = false;
    const expectedErrorObject = {
      email: "Email is invalid",
    };
    const { errors, isValid } = validateUserSignup(data);
    compareResultsToExpected(
      validRequest,
      expectedErrorObject,
      isValid,
      errors
    );
  });

  it("should return an error if password is empty", () => {
    data.password = "";
    validRequest = false;
    const expectedErrorObject = {
      password:
        "Password field is required and must be " +
        passwordMinLength +
        " or more characters",
    };
    const { errors, isValid } = validateUserSignup(data);
    compareResultsToExpected(
      validRequest,
      expectedErrorObject,
      isValid,
      errors
    );
  });

  it(
    "should return an error if password is shorter than " + passwordMinLength,
    () => {
      data.password = "abc";
      validRequest = false;
      const expectedErrorObject = {
        password:
          "Password field is required and must be " +
          passwordMinLength +
          " or more characters",
      };
      const { errors, isValid } = validateUserSignup(data);
      compareResultsToExpected(
        validRequest,
        expectedErrorObject,
        isValid,
        errors
      );
    }
  );

  it("should return an error if passwordVerification does not match password", () => {
    data.passwordVerification = "differentpassword";
    validRequest = false;
    const expectedErrorObject = {
      passwordVerification: "Passwords do not match", // 2
    };
    const { errors, isValid } = validateUserSignup(data);
    compareResultsToExpected(
      validRequest,
      expectedErrorObject,
      isValid,
      errors
    );
  });
});

describe("validateLoginInput", () => {
  let data;
  let validRequest;
  beforeEach(() => {
    data = {
      loginId: "testlogin",
      password: "password",
    };
    validRequest = true;
  });

  it("should return an object with errors and isValid properties", () => {
    const result = validateLoginInput(data);
    assert.strictEqual(typeof result, "object");
    assert.strictEqual(typeof result.errors, "object");
    assert.strictEqual(typeof result.isValid, "boolean");
  });

  it("should return isValid as true when there are no errors", () => {
    const result = validateLoginInput(data);
    assert.strictEqual(result.isValid, validRequest);
  });

  it("should return an error if loginId is empty", () => {
    data.loginId = "";
    validRequest = false;
    const expectedErrorObject = {
      loginId: "Login ID is required",
    };
    const { errors, isValid } = validateLoginInput(data);
    compareResultsToExpected(
      validRequest,
      expectedErrorObject,
      isValid,
      errors
    );
  });

  it("should return an error if password is empty", () => {
    data.password = "";
    validRequest = false;
    const expectedErrorObject = {
      password: "Password field is required",
    };
    const { errors, isValid } = validateLoginInput(data);
    compareResultsToExpected(
      validRequest,
      expectedErrorObject,
      isValid,
      errors
    );
  });
});

// put the expect comparisons into a single spot
function compareResultsToExpected(
  expectedValid,
  expectedErrorObject,
  returnedValid,
  returnedErrorObject
) {
  assert.strictEqual(returnedValid, expectedValid);
  // if we don't expect it to be valid, check for the expected error response
  if (!expectedValid) {
    expect(returnedErrorObject).toEqual(
      // 1
      expect.objectContaining(expectedErrorObject)
    );
  }
}
