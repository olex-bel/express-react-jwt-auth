const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { check } = require("express-validator");
const { validateRequestResult } = require("../middleware/validate");
const { verifyRefreshToken, verifyAccessToken } = require("../middleware/verify");

router.post(
    "/login",
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    check("password").not().isEmpty(),
    validateRequestResult,
    authController.login
);

router.post(
    "/refresh",
    verifyRefreshToken,
    authController.refresh
);

router.post(
    "/logout",
    verifyAccessToken,
    authController.logout
);

module.exports = router;