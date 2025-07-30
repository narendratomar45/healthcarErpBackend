import Joi from "joi";

export const patientValidationSchema = Joi.object({
  user: Joi.string().required(),
  address: Joi.string().required(),
  emergencyContact: Joi.object({
    name: Joi.string().allow(""),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .allow(""),
  }),
  medicalHistory: Joi.array().items(Joi.string()).default([]),
  allergies: Joi.array().items(Joi.string()).default([]),
});
