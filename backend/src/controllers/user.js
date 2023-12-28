
const User = require("../models/user");

async function register(req, res) {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: "failed",
                data: {},
                message: "It seems you already have an account, please log in instead.",
            });
        }

        const user = new User({
            name,
            email,
            password,
        });

        await user.save();
        
        res.status(201).json({
            status: "success",
            data: {
                user,
            },
            message:
                "Thank you for registering with us. Your account has been successfully created.",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: {},
            message: "Internal Server Error",
        });
    }
    res.end();
}


async function me(req, res) {
    const user = req.user;

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
        message: "You profile data.",
    });
}

module.exports = {
    register,
    me,
};
