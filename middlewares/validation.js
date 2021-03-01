const { body } = require("express-validator");
//sanitize

exports.sanitizeRegistration = [body("username").toLowerCase(), body("lname").trim()];

//validation during registratiion
exports.checkPassword = (req, res, next) => {
     body("password");
};
