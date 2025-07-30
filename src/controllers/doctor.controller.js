import Doctor from "../models/doctor.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { createAddress } from "../utils/createAddress.js";
import bcrypt from "bcryptjs";

export const createDoctor = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === "admin";
  if (!isAdmin) {
    return res
      .status(403)
      .json({ status: "Failed", message: "Only admin can create doctor" });
  }

  const userId = req.params.id;
  if (!userId) {
    return res
      .status(400)
      .json({ status: "Failed", message: "User ID is required in params" });
  }
  const userExists = await User.findById(userId);
  if (!userExists) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const doctorExists = await Doctor.findOne({ user: userId });
  if (doctorExists) {
    return res
      .status(400)
      .json({ success: false, message: "Doctor already exists for this user" });
  }
  const {
    role,
    specialization,
    department,
    qualifications,
    experience,
    phone,
    profileImage,
    street,
    city,
    state,
    zipCode,
    nationality,
  } = req.body;
  if (
    !role ||
    !specialization ||
    !department ||
    !experience ||
    !phone ||
    !street ||
    !city ||
    !state ||
    !zipCode
  ) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be filled",
    });
  }

  const addresses = await createAddress({
    userId,
    street,
    city,
    state,
    zipCode,
    nationality,
  });

  if (userExists.role !== role) {
    userExists.role = role;
    await userExists.save();
  }
  const newDoctor = await Doctor.create({
    user: userId,
    role,
    specialization,
    department,
    qualifications,
    experience,
    phone,
    profileImage,
    address: addresses._id,
  });
  const fullDoctor = await Doctor.findById(newDoctor._id)
    .populate("user", "userfullName email role")
    .populate("address");
  res.status(201).json({
    status: "Success",
    message: "Doctore created successfully",
    data: fullDoctor,
  });
});
export const getDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ status: "Failed", message: "Doctor id is required" });
  }

  const existDoctor = await Doctor.findById(id)
    .populate("user")
    .populate("address");
  if (!existDoctor) {
    return res
      .status(400)
      .json({ status: "Failed", message: "Doctor doesn't exist" });
  }
  res.status(200).json({ status: "success", data: existDoctor });
});
export const getAllDoctors = asyncHandler(async (req, res) => {
  const doctor = await Doctor.find();
  if (!doctor) {
    return res.status(400).json({ status: "Doctor is not found" });
  }
  res
    .status(200)
    .json({ status: "Success", message: "Doctor's data found", data: doctor });
});
export const updateDoctor = asyncHandler(async (req, res) => {
  console.log("RB", req.body);
  const isAdmin = req.user.role === "admin";
  const userId = isAdmin ? req.params.id : req.user._id;

  if (!userId) {
    return res
      .status(400)
      .json({ status: "Failed", message: "Doctor id is not found" });
  }
  const {
    fullName,
    email,
    password,
    specialization,
    department,
    qualifications,
    experience,
    phone,
    profileImage,
    street,
    city,
    state,
    zipCode,
    nationality,
  } = req.body;

  const existingDoctor = await Doctor.findById(userId);
  if (!existingDoctor) {
    return res
      .status(400)
      .json({ status: "Failed", message: "Doctor not found" });
  }
  if (
    req.user.role === "doctor" &&
    req.user._id.toString() !== existingDoctor.user._id.toString()
  ) {
    return res
      .status(403)
      .json({ message: "You can only update your own profile." });
  }
  const updateFields = {};

  if (fullName) {
    if (fullName.length < 3 || fullName.length > 30) {
      return res.status(400).json({
        status: "Failed",
        message: "fullName must be between 3 and 30 characters",
      });
    }
    updateFields.fullName = fullName;
  }

  if (
    email &&
    email.trim().toLowerCase() !== existingDoctor.email.trim().toLowerCase()
  ) {
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ status: "Failed", message: "Please provide a valid email" });
    }
    const emailExist = await Doctor.findOne({ email, _id: { $ne: userId } });
    if (emailExist) {
      return res
        .status(409)
        .json({ status: "Failed", message: "Email already in use" });
    }
    updateFields.email = email;
  }

  if (password) {
    if (password.length < 8) {
      return res.status(400).json({
        status: "Failed",
        message: "Password length must be at least 8 characters",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    updateFields.password = hashedPassword;
  }

  if (phone) {
    if (!validator.isMobilePhone(phone)) {
      return res
        .status(400)
        .json({ status: "Failed", message: "Invalid phone number" });
    }
    const phoneExist = await Doctor.findOne({ phone, _id: { $ne: userId } });
    if (phoneExist) {
      return res
        .status(409)
        .json({ status: "Failed", message: "Phone number already in use" });
    }
    updateFields.phone = phone;
  }

  // Optional fields
  if (specialization) updateFields.specialization = specialization;
  if (department) updateFields.department = department;
  if (qualifications) updateFields.qualifications = qualifications;
  if (experience) {
    if (isNaN(experience)) {
      return res.status(400).json({
        status: "Failed",
        message: "Experience must be a number",
      });
    }
    updateFields.experience = experience;
  }
  if (profileImage) updateFields.profileImage = profileImage;
  if (street) updateFields.street = street;
  if (city) updateFields.city = city;
  if (state) updateFields.state = state;
  if (zipCode) updateFields.zipCode = zipCode;
  if (nationality) updateFields.nationality = nationality;

  const updatedDoctor = await Doctor.findByIdAndUpdate(userId, updateFields, {
    new: true,
    runValidators: true,
  }).select("-password");

  return res.status(200).json({ status: "Success", data: updatedDoctor });
});
export const deleteDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ status: "Failed", message: "Doctor id is required" });
  }
  const doctor = await Doctor.findById(id);
  if (!doctor) {
    return res
      .status(400)
      .json({ status: "Failed", message: "Doctor is not found" });
  }
  const existingDoctor = await Doctor.findByIdAndDelete(id);

  res.status(200).json({
    status: "Success",
    message: "Deleted Successfully",
    data: existingDoctor,
  });
});
