const Validator = require("validator");
const assert = require("assert");
const mongoose = require("mongoose");
const User = require("../../models/User");
const db = require("../config/db_setup");
const testPassword = "password123";
describe("User Model", () => {
  beforeAll(async () => {
    await db.setUp();
  });

  afterEach(async () => {
    await db.dropCollections();
  });

  afterAll(async () => {
    await db.dropDatabase();
  });

  it("Should save a new user", async () => {
    expect.assertions(1);

    const newUser = new User({
      loginId: "testuser",
      fullName: "Test User",
      email: "test@example.com",
      // file deepcode ignore NoHardcodedPasswords/test: this is a test only file and will not persist to real storage (in memory DB only)
      password: testPassword,
    });
    const savedUser = await newUser.save();

    expect(savedUser._id).toBeDefined();
  });

  it("Should not save a user with missing required fields", async () => {
    expect.assertions(1);

    const newUser = new User({
      fullName: "Test User",
      email: "test@example.com",
      password: testPassword,
    });

    try {
      await newUser.save();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("Should require loginId to have minimum length", async () => {
    expect.assertions(1);

    const newUser = new User({
      loginId: "abc",
      fullName: "Test User",
      email: "test@example.com",
      password: testPassword,
    });

    try {
      await newUser.save();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("Should require password to have minimum length", async () => {
    expect.assertions(1);

    const newUser = new User({
      loginId: "testuser",
      fullName: "Test User",
      email: "test@example.com",
      password: "short",
    });

    try {
      await newUser.save();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("Should save a new user and retrieve it", async () => {
    expect.assertions(1);

    const newUser = new User({
      loginId: "testuser",
      fullName: "Test User",
      email: "test@example.com",
      // file deepcode ignore NoHardcodedPasswords/test: this is a test only file and will not persist to real storage (in memory DB only)
      password: testPassword,
    });
    const savedUser = await newUser.save();
    const foundUser = await User.findOne({ loginId: savedUser.loginId });
    expect(foundUser._id).toBeDefined();
    assert.strictEqual(foundUser.loginId, savedUser.loginId);
    assert.strictEqual(foundUser.email, savedUser.email);
  });
});
