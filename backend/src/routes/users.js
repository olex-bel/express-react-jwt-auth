const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { validateRequestResult } = require("../middleware/validate");
const { verifyAccessToken } = require("../middleware/verify");
const userController = require("../controllers/user");

router.post("/register",
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    check("name")
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage("You name is required"),
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Must be at least 8 chars long"),
    validateRequestResult,
    userController.register
);

router.get(
    "/me",
    verifyAccessToken,
    userController.me
);

module.exports = router;
