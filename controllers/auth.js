//imports
const User = require("../models/user");
const bcrypt = require("bcrypt");
const salt = 10;

//accessperms

const ac = require("../permissions");

exports.getLogin = (req, res, next) => {
     const loggedIn = req.session.isLoggedIn;
     console.log("GETLOGIN " + loggedIn);
     if (loggedIn) {
          return res.redirect("/user/home");
     }
     res.render("auth/login", {
          title: "Chat",
     });
};
exports.getLogout = (req, res, next) => {
     req.session.destroy();
     res.redirect("/");
};

exports.postLogin = async (req, res, next) => {
     const username = req.body.username;
     const fname = req.body.fname;
     const lname = req.body.lname;
     const nickname = req.body.nickname;
     const password = req.body.password;

     console.log(username);
     //check if user exists
     //if yes, check if passwords match
     //if user doesnt exist or passwords dont match, send an error message.

     try {
          const user = await User.findOne({ username: username });
          if (!user) {
               const error = new Error("Username or Password Incorrect");
               error.statusCode = 401;
               throw error;
          }
          const result = await bcrypt.compare(password, user.password);
          if (!result) {
               const error = new Error("Username or Password Incorrect");
               error.statusCode = 401;
               throw error;
          }
          const perms = ac.can(user.role).readOwn("homepage");
          console.log(perms);
          console.log(perms.granted);
          //only allow a user to login if they have permission to do so
          if (!perms.granted) {
               const error = new Error("You have been banned from Chat");
               error.statusCode = 403;
               throw error;
          }

          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save((err) => {
               res.redirect("/user/home");
          });
     } catch (err) {
          next(err);
     }
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
               bcrypt.hash(password, salt, async (err, hashedPassword) => {
                    if (err) {
                         console.log(err);
                    }
                    console.log(hashedPassword);
                    const user = await User.create({
                         lname: lname,
                         fname: fname,
                         username: username,
                         nickname: nickname,
                         password: hashedPassword,
                    });
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    req.session.save((err) => {
                         res.redirect("/user/home");
                    });
               });
          }
     } catch (err) {
          next(err);
     }

     //otherwise continue with registration
};
