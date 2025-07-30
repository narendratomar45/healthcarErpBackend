import Address from "../models/address.model.js";
import Patient from "../models/patient.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { generateUniqueId } from "../utils/generateUniqueId.js";
import { patientValidationSchema } from "../validators/patientRegistration.validation.js";

const createPatient = asyncHandler(async (req, res) => {
  const addressId = req.body.address;
  if (!addressId) {
    return res
      .status(400)
      .json({ status: "Failed", message: "Address is required" });
  }

  const { error, value } = patientValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: "Validation failed",
      errors: error.details.map((err) => err.message),
    });
  }
  const { user, address, emergencyContact, medicalHistory, allergies } = value;

  const existingUser = await User.findById(user);
  if (!existingUser) {
    return res.status(404).json({ status: "fail", message: "User not found" });
  }
  const existAddress = await Address.findById(addressId);
  if (!existAddress) {
    return res
      .status(404)
      .json({ status: "fail", message: "Patient address not found" });
  }
  const existingPatient = await Patient.findOne({ user });
  if (existingPatient) {
    return res.status(409).json({
      status: "fail",
      message: "Patient already registered for this user",
    });
  }

  const patientUniqueId = await generateUniqueId("patient");
  console.log("PI", patientUniqueId);

  const patient = await Patient.create({
    user,
    address,
    patientId: patientUniqueId,
    emergencyContact,
    medicalHistory,
    allergies,
  });
  console.log("P", patient);

  const newPatient = await Patient.findById(patient._id)
    .populate({ path: "user", select: "-password" })
    .populate("address");

  res.status(201).json({ status: "success", data: newPatient });
});
const getPatient = asyncHandler(async (req, res) => {
  const patientId = req.params.id;
  console.log("RQ", req.params.id);
  const existingPatient = await Patient.findById(patientId)
    .populate({
      path: "user",
      select: "-password",
    })
    .populate("address");
  if (!existingPatient) {
    return res
      .status(404)
      .json({ status: "Failed", message: "Patient is not exists" });
  }
  res.status(200).json({ status: "Success", data: existingPatient });
});
const getAllPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find()
    .populate({
      path: "user",
      select: "-password",
    })
    .populate("address");
  if (!patients) {
    res.status(404).json({ status: "fail", message: "No Patient is register" });
  }
  res.status(201).json({ status: "success", data: patients });
});
const updatePatient = asyncHandler(async (req, res) => {
  const patientId = req.params.id;
  const {
    fullName,
    email,
    password,
    phone,
    dob,
    bloodGroup,
    street,
    city,
    state,
    zipCode,
    maritalStatus,
    nationality,
  } = req.body;

  const existingPatient = await Patient.findById(patientId).populate("address");

  if (!existingPatient) {
    return res
      .status(404)
      .json({ status: "Fail", message: "Patient Not Found" });
  }
  if (
    req.user.role === "patient" &&
    req.user._id.toString() !== existingPatient.user._id.toString()
  ) {
    return res
      .status(403)
      .json({ message: "You can only update your own profile." });
  }
  const updatedField = {};

  if (fullName) {
    if (fullName.length < 3 || fullName.length > 30) {
      return res.status(400).json({
        status: "Failed",
        message:
          fullName.length < 3
            ? "Name must be at least 3 characters"
            : "Name must be less than 30 characters",
      });
    }
    updatedField.fullName = fullName;
  }

  if (email) {
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ status: "Failed", message: "Email is invalid" });
    }
    const existEmail = await Patient.findOne({
      email,
      _id: { $ne: patientId },
    });
    if (existEmail) {
      return res
        .status(409)
        .json({ status: "Fail", message: "Email already in use" });
    }
    updatedField.email = email;
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
    updatedField.password = hashedPassword;
  }

  if (phone && phone !== existingPatient.phone) {
    const phoneExists = await Patient.findOne({
      phone,
      _id: { $ne: patientId },
    });
    if (phoneExists) {
      return res
        .status(409)
        .json({ status: "Fail", message: "Phone number already in use" });
    }
    updatedField.phone = phone;
  }

  if (dob) {
    const newDate = new Date(dob);
    const today = new Date();
    if (isNaN(newDate.getTime())) {
      return res
        .status(400)
        .json({ status: "Failed", message: "Invalid date format" });
    }
    if (newDate > today) {
      return res.status(400).json({
        status: "Failed",
        message: "Date of Birth can't be in future",
      });
    }
    updatedField.dob = dob;
  }

  if (bloodGroup) {
    const allowedBloodGroups = [
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
    ];
    if (!allowedBloodGroups.includes(bloodGroup.toUpperCase())) {
      return res
        .status(400)
        .json({ status: "Failed", message: "Invalid blood group" });
    }
    updatedField.bloodGroup = bloodGroup.toUpperCase();
  }

  if (maritalStatus) {
    updatedField.maritalStatus = maritalStatus;
  }

  if (street || city || state || zipCode || nationality) {
    if (existingPatient.address) {
      const address = await Address.findById(existingPatient.address);
      if (street) address.street = street;
      if (city) address.city = city;
      if (state) address.state = state;
      if (zipCode) address.zipCode = zipCode;
      if (nationality) address.nationality = nationality;
      await address.save();
    } else {
      const newAddress = await Address.create({
        street,
        city,
        state,
        zipCode,
        nationality,
      });
      updatedField.address = newAddress._id;
    }
  }

  existingPatient.set(updatedField);
  await existingPatient.save();

  const updatedPatient = await Patient.findById(patientId)
    .select("-password")
    .populate("address");

  return res.status(200).json({
    status: "Success",
    data: updatedPatient,
  });
});
const deletePatient = asyncHandler(async (req, res) => {
  const patientId = req.params.id;
  const existingPatient = await Patient.findByIdAndDelete(patientId);
  if (!existingPatient) {
    return res
      .status(404)
      .json({ status: "Fail", message: "Patient not found" });
  }
  res.status(200).json({
    status: "success",
    message: "Patient deleted successfully",
  });
});
export {
  createPatient,
  getPatient,
  getAllPatients,
  updatePatient,
  deletePatient,
};
