import Address from "../models/address.model.js";

export const createAddress = async ({
  street,
  city,
  state,
  zipCode,
  nationality = "India",
}) => {
  try {
    if (!street || !city || !state || !zipCode || !nationality) {
      throw new Error("Missing required address fields");
    }
    const newAddress = await Address.create({
      street,
      city,
      state,
      zipCode,
      nationality,
    });
    return newAddress;
  } catch (error) {
    console.error("ERRINADD", error);
    throw error;
  }
};
