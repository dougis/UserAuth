const Validator = require("validator");
const assert = require("assert");
const User = require("../../models/User");
const {
  validateUserSignup,
  validateLoginInput,
  loginIdInUse,
  emailInUse,
  userIdMinLength,
  passwordMinLength,
} = require("../../utils/validation");

const db = require("../config/db_setup");
const testUserData = {
  loginId: "duplicate",
  fullName: "Test User",
  email: "duplicate@example.com",
  password: "password",
};
let testUser = new User(testUserData);
beforeAll(async () => {
  await db.setUp();
  console.log("DB url is \n" + db.mongoUrl);
});

// beforeEach(async () => {
//   await db.setUp();
//   // testUser = new User(testUserData);
//   // const savedUser = await testUser.save();
// });

// afterEach(async () => {
//   await db.dropDatabase();
//   // testUser = new User(testUserData);
//   // const savedUser = await testUser.save();
// });

afterAll(async () => {
  await db.dropDatabase();
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
      expect.objectContaining(expectedErrorObject)
    );
  }
}

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
  it("should return isValid as true when there are no errors with full name passed as null", () => {
    data.fullName = null;
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
      passwordVerification: "Passwords do not match",
    };
    const { errors, isValid } = validateUserSignup(data);
    compareResultsToExpected(
      validRequest,
      expectedErrorObject,
      isValid,
      errors
    );
  });

  it("should return an error if passwordVerification is null", () => {
    data.passwordVerification = null;
    validRequest = false;
    const expectedErrorObject = {
      passwordVerification: "Passwords do not match",
    };
    const { errors, isValid } = validateUserSignup(data);
    compareResultsToExpected(
      validRequest,
      expectedErrorObject,
      isValid,
      errors
    );
  });
  it("should return an error if the email is already in use", () => {
    data.email = testUser.email;
    validRequest = false;
    const expectedErrorObject = {
      email: "Email address is already in use",
    };
    const { errors, isValid } = validateUserSignup(data);
    compareResultsToExpected(
      validRequest,
      expectedErrorObject,
      isValid,
      errors
    );
  });
  it("should return an error if the loginId is already in use", () => {
    data.loginId = testUser.loginId;
    validRequest = false;
    const expectedErrorObject = {
      loginId: "Login ID is already in use",
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

describe("Utility checks, finding existing users", () => {
  it("should find the test user based on email", async () => {
    testUser = new User(testUserData);
    const savedUser = await testUser.save();
    const foundUser = emailInUse(testUser.email);
    assert.strictEqual(typeof foundUser, "object");
    assert.strictEqual(foundUser.loginId, testUser.loginId);
  });

  it("should find the test user based on loginId", async () => {
    testUser = new User(testUserData);
    const savedUser = await testUser.save();
    const foundUser = await loginIdInUse(testUser.loginId);
    console.log("User returned from Mongo\n" + foundUser);
    assert.strictEqual(typeof foundUser, "object");
    assert.strictEqual(foundUser.email, testUser.email);
  });
});
