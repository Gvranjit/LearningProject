//imports
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
     res.render("auth/login", {
          title: "Chat",
     });
};
exports.postRegister = async (req, res, next) => {
     //check if the user exists
     const username = req.body.username;
     const fname = req.body.fname;
     const lname = req.body.lname;
     const nickname = req.body.nickname;
     const password = req.body.password;

     //if exists, send back an error message and redirect to registration

     try {
          const user = await User.findOne({ username: username });
          if (user) {
               const error = new Error("User already exists");
               throw error;
          } else {
               const user = await User.create({
                    lname: lname,
                    fname: fname,
                    username: username,
                    nickname: nickname,
               });
          }
     } catch (err) {
          next(err);
     }

     //otherwise continue with registration
};
