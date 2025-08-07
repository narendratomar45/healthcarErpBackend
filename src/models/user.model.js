import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      minLength: [3, "Name should be atleast 3 characters"],
      maxLength: [30, "Name should not be more than 30 characters"],
      required: [true, "fullName is required"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "fullName can only contain letters, numbers and underscores",
      ],
      trim: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: [
        "admin",
        "doctor",
        "nurse",
        "labtech",
        "pharmacist",
        "receptionist",
        "patient",
      ],
      default: "patient",
    },
    phone: {
      type: String,
      required: [true, "Phone Number is required"],
      unique: true,
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
      validate: {
        validator: (v) => v < new Date(),
        message: "Date of bitrh must be in past",
      },
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Don't Know"],
    },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      default: "Single",
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  if (user.isModified("fullName") && user.role !== "patient") {
    const existingUser = await mongoose.models.User.findOne({
      fullName: user.fullName,
      role: { $ne: "patient" },
      _id: { $ne: user._id },
    });

    if (existingUser) {
      return next(new Error("fullName already taken by another staff member"));
    }
  }
  next();
});
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};
userSchema.methods.comparePassword = async function (enterPassword) {
  const user = this;
  return await bcrypt.compare(enterPassword, user.password);
};

const User = mongoose.model("User", userSchema);
export default User;
