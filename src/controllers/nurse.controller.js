import Nurse from "../models/nurse.model.js";
import { asyncHandler } from "../utils/AsyncHandler";

export const createNurse = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res
      .status(404)
      .json({ status: "Failed", message: "UserID not found" });
  }
  const { department, shift, address } = req.body;
  if (!department || !shift || !address) {
    throw new APIError("Email and Password are required", 400);
  }
  const existNurse = await Nurse.findOne({ user: userId });
  if (existNurse) {
    return res.status(409).json({ status: "Failed", message: "Already Exist" });
  }
  const nurse = await Nurse.create({
    user: userId,
    department,
    shift,
    address,
  });
  res.status(201).json({
    status: "Failed",
    message: "Nurse Created Successfully",
    data: nurse,
  });
});
export const getAllNurses = asyncHandler(async (req, res) => {
  const nurses = await Nurse.find()
    .populate({
      path: "user",
      select: "-password",
    })
    .populate("address");
  if (!nurse || nurse.length === 0) {
    return res.status(404).json({ status: "Failed", message: "No data found" });
  }
  res.status(200).json({
    status: "success",
    message: "All data fetched successfully",
    data: nurses,
  });
});
export const getNurseByID = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(404).json({ status: "Failed", message: "No data found" });
  }
  const nurse = await Nurse.findById({ user: userId })
    .populate({
      path: "user",
      select: "-password",
    })
    .populate("address");
  if (!nurse) {
    return res.status(404).json({ status: "Failed", message: "No Data Found" });
  }
  res.status(200).json({
    status: "Success",
    message: "Data fetches Successfully",
    data: nurse,
  });
});
export const updateNurse = asyncHandler(async (req, res) => {
  const nurseId = req.params.id;
  const nurseRole = req.user.role;
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

  const existingNurse = await Nurse.findById(nurseId)
    .populate({ path: "user" })
    .populate("address");

  if (!existingNurse) {
    return res.status(404).json({
      status: "Failed",
      message: "Nurse not found",
    });
  }
  if (
    nurseRole === "nurse" &&
    req.user._id.toString() !== existingNurse.user.toString()
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
    const existEmail = await Nurse.findOne({
      email,
      _id: { $ne: existingNurse.user._id },
    });
    if (existEmail) {
      return res
        .status(409)
        .json({ status: "Fail", message: "Email already in use" });
    }
    updatedField.email = email;

    if (existingNurse.user) {
      existingNurse.user.email = email;
      await existingNurse.user.save();
    }
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

    if (existingNurse.user) {
      existingNurse.user.password = hashedPassword;
      await existingNurse.user.save();
    }
  }

  if (phone && phone !== existingNurse.phone) {
    const phoneExists = await Nurse.findOne({
      phone,
      _id: { $ne: existingNurse.user._id },
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
    if (existingNurse.address) {
      const address = await Address.findById(existingNurse.address);
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

  const updatedNurse = await Nurse.findByIdAndUpdate(nurseId, updatedField, {
    new: true,
  }).populate("address");

  res.status(200).json({
    status: "Success",
    message: "Nurse updated successfully",
    data: updatedNurse,
  });
});
export const deleteNurse = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(404).json({
      status: "Failed",
      message: "Nurse ID not found in request params",
    });
  }
  const existNurse = await Nurse.findById(id);
  if (!existNurse) {
    return res.status(404).json({
      status: "Failed",
      message: "Data not found",
    });
  }
  const deletedNurse = await Nurse.findByIdAndDelete(id);
  res.status(200).json({
    status: "Success",
    message: "Data deleted sucessfully",
    data: deletedNurse,
  });
});
