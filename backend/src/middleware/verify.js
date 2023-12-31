const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function verifyAccessToken(req, res, next) {
    try {
        const accessToken = req.header("Authorization")?.replace("Bearer ", "");
        const refreshToken = req.cookies["refreshToken"];

        if (!accessToken && !refreshToken) {
            return res.status(401).send({ 
                status: "error",
                data: {},
                message: "Access Denied." 
            });
        }

        jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN, async (err, decoded) => {
            if (err) {
                return res
                    .status(403)
                    .json({ 
                        status: "error",
                        data: {},
                        message: "This session has expired. Please login" 
                    });
            }

            const { _id } = decoded;
            const user = await User.findOne({ _id: _id, "tokens.token": refreshToken });

            if (!user) {
                return res
                    .status(401)
                    .json({ 
                        status: "error",
                        data: {},
                        message: "Access Denied." 
                    });
            }

            req.user = user;
            req.accessToken = accessToken;
            next();
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            data: {},
            message: "Internal Server Error",
        });
    }
}

async function verifyRefreshToken(req, res, next) {
    try {
        const refreshToken = req.cookies["refreshToken"];

        if (!refreshToken) {
            return res.status(401).send({ 
                status: "error",
                data: {},
                message: "Access Denied." 
            });
        }

        jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, async (err, decoded) => {
            if (err) {
                return res
                    .status(401)
                    .json({ 
                        status: "error",
                        data: {},
                        message: "This session has expired. Please login" 
                    });
            }

            const { _id } = decoded;
            const user = await User.findOne({ _id: _id, "tokens.token": refreshToken });

            if (!user) {
                return res
                    .status(401)
                    .json({ 
                        status: "error",
                        data: {},
                        message: "Access Denied." 
                    });
            }

            req.user = user;
            req.refreshToken = refreshToken;
            next();
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            data: {},
            message: "Internal Server Error",
        });
    }
}

module.exports = {
    verifyRefreshToken: verifyRefreshToken,
    verifyAccessToken: verifyAccessToken,
};
