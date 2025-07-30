import User from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createAddress } from "../utils/createAddress.js";
dotenv.config();

const createUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    role,
    password,
    phone,
    dob,
    gender,
    bloodGroup,
    maritalStatus,
    street,
    city,
    state,
    zipCode,
  } = req.body;
  if (
    !fullName ||
    !password ||
    !phone ||
    !dob ||
    !gender ||
    !bloodGroup ||
    !maritalStatus ||
    !street ||
    !city ||
    !state ||
    !zipCode
  ) {
    return res
      .status(400)
      .json({ status: "Failed", message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ status: "Failed", message: "User is already registered " });
  }
  let addresses = await createAddress({
    street,
    city,
    state,
    zipCode,
  });
  const user = await User.create({
    fullName,
    email,
    password,
    role,
    phone,
    dob,
    gender,
    bloodGroup,
    maritalStatus,
    address: addresses._id,
  });

  return res.status(201).json({
    status: "Success",
    message: "User creted successfully",
    user,
  });
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ statu: "failed", message: "Email and Password are required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(401)
      .json({ status: "Failed", message: "Invalid Credentials" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ status: "failed", message: "Invalid Credentials" });
  }
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000 * 7,
  });
  user.password = undefined;
  res.status(200).json({ status: "Success", user, token });
});
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ status: "Failed", message: "User ID not found" });
  }
  const user = await User.findById(id).populate("address").lean();
  if (!user) {
    return res
      .status(400)
      .json({ status: "Failed", message: "User Not Found" });
  }
  res.status(200).json({ status: "success", data: user });
});
const getAllusers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").populate("address");
  if (!users || users.length === 0) {
    return res
      .status(404)
      .json({ status: "Failed", message: "Users not found" });
  }
  res.status(200).json({
    status: "Success",
    message: "Users found Successfully",
    count: users.length,
    data: users,
  });
});
const updateUser = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === "admin";
  const userId = isAdmin ? req.params.id : req.user._id;

  const existingUser = await User.findById(userId);
  if (!existingUser) {
    return res
      .status(404)
      .json({ status: "Failed", message: "User not found" });
  }

  const {
    fullName,
    email,
    password,
    role,
    phone,
    dob,
    gender,
    bloodGroup,
    maritalStatus,
    street,
    city,
    state,
    zipCode,
  } = req.body;

  const updatedFields = {};

  if (fullName) {
    if (fullName.length < 3 || fullName.length > 30) {
      return res.status(400).json({
        status: "Failed",
        message: "fullName must be between 3-30 characters",
      });
    }
    updatedFields.fullName = fullName;
  }

  if (
    email &&
    email.trim().toLowerCase() !== existingUser.email.trim().toLowerCase()
  ) {
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ status: "failed", message: "Please Provide a valid email" });
    }

    const existEmail = await User.findOne({ email, _id: { $ne: userId } });
    if (existEmail) {
      return res
        .status(400)
        .json({ status: "failed", message: "Email already used" });
    }

    updatedFields.email = email;
  }

  if (password) {
    if (password.length < 8) {
      return res.status(400).json({
        status: "Failed",
        message: "Password must be at least 8 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    updatedFields.password = hashedPassword;
  }

  if (role && req.user.role === "admin") {
    const allowedRoles = [
      "admin",
      "doctor",
      "nurse",
      "labtech",
      "pharmacist",
      "receptionist",
      "patient",
    ];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid role specified",
      });
    }
    updatedFields.role = role;
  }

  if (phone) {
    if (!validator.isMobilePhone(phone)) {
      return res
        .status(400)
        .json({ status: "Failed", message: "Phone Number is invalid" });
    }
    updatedFields.phone = phone;
  }

  if (dob) {
    const dobDate = new Date(dob);
    if (dobDate > new Date()) {
      return res.status(400).json({
        status: "Failed",
        message: "Date of Birth can't be in the future",
      });
    }
    updatedFields.dob = dobDate;
  }

  if (gender) updatedFields.gender = gender;
  if (bloodGroup) updatedFields.bloodGroup = bloodGroup;
  if (maritalStatus) updatedFields.maritalStatus = maritalStatus;

  if (street || city || state || zipCode) {
    const userWithAddress = await User.findById(userId).populate("address");
    const address = userWithAddress.address;

    if (address) {
      if (street) address.street = street;
      if (city) address.city = city;
      if (state) address.state = state;
      if (zipCode) address.zipCode = zipCode;
      await address.save();
    } else {
      const newAddress = await createAddress({
        street,
        city,
        state,
        zipCode,
      });
      updatedFields.address = newAddress._id;
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
    new: true,
    runValidators: true,
  })
    .select("-password")
    .populate("address");

  res.status(200).json({ status: "Success", data: updatedUser });
});
const deleteUser = asyncHandler(async (req, res) => {
  console.log("p", req.params);
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return res
      .status(404)
      .json({ status: "Failed", message: "User not found" });
  }
  await User.findByIdAndDelete(userId);
  res
    .status(200)
    .json({ status: "Success", message: "User Deleted Successfully" });
});
export { createUser, loginUser, getUser, getAllusers, updateUser, deleteUser };
