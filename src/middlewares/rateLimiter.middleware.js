import rateLimit from "express-rate-limit";
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: "failed",
    message: "Too many login attempts. Try again in 15 minutes.",
  },
});

export const signupLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000,
  max: 10,
  message: {
    status: "failed",
    message: "Too many signup attempts. Try again in 1 hour.",
  },
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
