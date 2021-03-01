const User = require("../models/user");
const Role = require("../models/roles");

exports.getUserHome = (req, res, next) => {
     const user = req.session.user;
     res.render("home", { title: "Home", username: user.fname });
};
