import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MONGODB Connected Successfully");
  } catch (error) {
    console.error("MONGODB Connection Error", error.message);
  }
};

const shutDownDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed gracefully");
  } catch (error) {
    console.error(" Error closing MongoDB connection:", error.message);
    throw error;
  }
};
export { connectDB, shutDownDB };
