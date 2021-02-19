//imports

const User = require("../models/user");
const pageSize = 3;

//accesscontrol

const ac = require("../permissions");

//exports

exports.postEditUser = async (req, res, next) => {
     const data = req.body;
     console.log(data)
     const editableUser = {
          fname: data.fname,
          lname: data.lname,
          nickname: data.nickname,
          username: data.username,
          role:data.role
     };
     console.log(editableUser)
     const user = req.session.user;

     try {
          if (!ac.can(user).updateAny("user")) {
               const error = new Error("Not Permitted");
               error.statusCode = 403;
               throw error;
          }

          const userData = await User.findOne({ username: editableUser.username });
          //just in case Userdata is deleted before the submission is done
          if (!userData) {
               const error = new Error("User not found in database");
               error.statusCode = 400;
               throw error;
          }

          const updatedUserData = await userData.update({
               lname: editableUser.lname,
               fname: editableUser.fname,
               nickname: editableUser.nickname,
               username: editableUser.username,
               role: editableUser.role,
          });
         
          res.redirect('/admin/manage-users');
     } catch (error) {next(error)}
};
exports.getEditUser = async (req, res, next) => {
     const editableUsername = req.params.username;
     const user = req.session.user;
     //check if the user exists and throw error if not
     try {
          if (!ac.can(user).updateAny("user")) {
               const error = new Error("Not Permitted");
               error.statusCode = 403;
               throw error;
          }
          const editableUser = await User.findOne({ username: editableUsername });
          if (!editableUser) {
               const error = new Error("No such user");
               error.statusCode = 400;
               throw error;
          }
          res.render("admin/edit-user", {
               editableUser: editableUser,

               title: "Edit User",
          });
     } catch (err) {
          next(err);
     }
};
exports.postDeleteUser = async (req, res, next) => {};

exports.postBanUser = async (req, res, next) => {};

exports.getManageUsers = async (req, res, next) => {
     const user = req.session.user;
     const currentPage = Number(req.query.page || 1);

     //get a list of all users available
     //USE PAGINATION, for large lists of user
     try {
          if (!ac.can(user).readAny("user").granted) {
               const error = new Error("You don't have permission to view this page");
               error.statusCode = 403;
               throw error;
          }
          const totalUsers = await User.count();
          //calculate the no. of pages
          const pages = Math.ceil(totalUsers / pageSize);
          console.log("Number of pages : ", pages);
          const userslist = await User.find()
               .skip(currentPage * pageSize - pageSize)
               .limit(pageSize);

          res.render("admin/manage-users", {
               title: "Manage Users",
               username: user.fname,
               users: userslist,
               pageSize: pageSize,
               pages: pages,
               currentPage: currentPage,
               nextPage: currentPage + 1,
               previousPage: currentPage - 1,
          });
     } catch (err) {
          next(err);
     }
};
