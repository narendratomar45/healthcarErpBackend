import rateLimit from "express-rate-limit";
export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: {
    status: "failed",
    message: "To many login attempts, please try after 5 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    status: "failed",
    message: "Too many attempts, please try after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
