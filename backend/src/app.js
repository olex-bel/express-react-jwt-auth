const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const app = express();
const corsOptions = {
    credentials: true,
    origin: process.env.ALLOW_ORIGIN_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/auth", authRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    console.log(err.message);

    // render the error page
    res.status(err.status || 500).send({
        status: "error",
        code: 500,
        data: [],
        message: "Internal Server Error",
    });
});

module.exports = app;
