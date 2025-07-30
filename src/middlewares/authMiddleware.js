import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";
dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ status: "Failed", message: "Not Authorized" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId).select("-password");
  if (!user) {
    return res.status(401).json({
      status: "Failed",
      message: "Not authorized, user not found",
    });
  }
  req.user = user;
  next();
});

const authorizedRole = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return res.status(403).json({
        status: "Failed",
        message: `Access denied for role: ${req.user.role}`,
      });
    }
    next();
  };
};
export { protect, authorizedRole };
