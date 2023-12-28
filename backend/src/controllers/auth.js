const User = require("../models/user");

async function login(req, res) {
    const { email } = req.body;

    try {
        const user = await User.findByCredentials(email, req.body.password);

        if (!user) {
            return res.status(401).json({
                status: "failed",
                data: {},
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
        }

        const refreshToken = await user.generateRefreshToken();
        const token = user.generateAccessToken();

        res.cookie("refreshToken", refreshToken, { 
            httpOnly: true,  
            sameSite: "None", 
            secure: true,  
            maxAge: 24 * 60 * 60 * 1000 
        }); 

        res.status(200).json({
            status: "success",
            data: { user, token },
            message: "You have successfully logged in.",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            data: {},
            message: "Internal Server Error",
        });
    }
}

async function logout(req, res) {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.refreshToken);
        await req.user.save();

        res.clearCookie("refreshToken", { httpOnly: true, sameSite: "None", secure: true });
        res.status(204).send({
            status: "success",
            data: {},
            message: "You have successfully logged out.",
        });
    } catch (e) {
        res.status(500).send({
            status: "error",
            data: {},
            message: "Internal Server Error",
        });
    }
}

async function refresh(req, res) {
    try {
        const acessToken = req.user.generateAccessToken();

        res.status(200).json({
            status: "success",
            data: {
                token: acessToken,
            },
            message: "The access token is generated.",
        });
    } catch (e) {
        res.status(500).send({
            status: "error",
            data: {},
            message: "Internal Server Error",
        });
    }
}

module.exports = {
    login,
    logout,
    refresh,
};