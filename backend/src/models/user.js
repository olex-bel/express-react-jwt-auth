
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Your name is required",
        unique: true,
        trim: true,
        max: 25,
    },
    email: {
        type: String,
        required: "Your email is required",
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: "Your password is required",
        select: false,
        max: 25,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
},
{ timestamps: true }
);

userSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }

            user.password = hash;
            next();
        });
    });
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return null;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return null;
    }

    return user;
};

userSchema.methods.toJSON = function () {
    const userObject = this.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.__v;

    return userObject;
};

userSchema.methods.generateRefreshToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_REFRESH_TOKEN);

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

userSchema.methods.generateAccessToken = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_ACCESS_TOKEN, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "10m",
    });
    return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;