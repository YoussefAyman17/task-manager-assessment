const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("Please provide name, email, and password", 400));
  }

  userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError("User already exists with this email", 400));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    status: "success",
    data: {
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    },
  });
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  res.status(200).json({
    status: "success",
    data: {
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    },
  });
});
