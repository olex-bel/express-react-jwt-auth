const { validationResult } = require("express-validator");

function  validateRequestResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = {};
        errors.array().map((err) => (error[err.path] = err.msg));
        return res.status(422).json({ error });
    }
    next();
}

module.exports = {
    validateRequestResult
};
