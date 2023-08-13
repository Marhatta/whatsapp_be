import createHttpError from "http-errors";
import validator from "validator";
import bcrypt from "bcrypt";
import { UserModel } from "../models/index.js";

// env variables
const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;

export const createUser = async userData => {
  const { name, email, picture, status, password } = userData;

  // check if fields are empty
  if (!name || !email || !password) {
    throw createHttpError.BadRequest("Please fill all fields");
  }

  // check name length
  if (!validator.isLength(name, { min: 2, max: 16 })) {
    throw createHttpError.BadRequest(
      "Please make sure your name is between 2 & 16 characters"
    );
  }

  // Check status length
  if (status && status.length > 64) {
    throw createHttpError.BadRequest(
      "Please make sure your status is less than 64 characters"
    );
  }

  // check if email address is valid
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest("Please enter a valid email address");
  }

  // check if user already exists
  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    throw createHttpError.Conflict(
      "User already exists. Please try again with a different email address"
    );
  }

  // check password length
  if (!validator.isLength(password, { min: 6, max: 128 })) {
    throw createHttpError.BadRequest(
      "Please make sure your password is between 6 and 128 characters"
    );
  }

  // hash password using mongo schema (in the user model using userSchema.pre method)

  // Save user to database
  const user = await new UserModel({
    name,
    email,
    picture: picture || DEFAULT_PICTURE,
    status: status || DEFAULT_STATUS,
    password
  }).save();

  return user;
};

export const signIn = async (email, password) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() });

  // check if user exists
  if (!user) {
    throw createHttpError.NotFound("Invalid credentials");
  }

  // compare passwords
  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw createHttpError.NotFound("Invalid credentials");
  }

  return user;
};
