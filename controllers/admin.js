//imports

const User = require("../models/user");
const Role = require ('../models/roles')
const pageSize = 3;

//accesscontrol

const ac = require("../permissions").ac;
const  Mongoose  = require("mongoose");

//exports

exports.postEditUser = async (req, res, next) => {
     const data = req.body;

     const editableUser = {
          fname: data.fname,
          lname: data.lname,
          nickname: data.nickname,
          username: data.username,
          role: data.role,
     };

     const user = req.session.user;

     try {
          const permission = ac().can(user.role.name).updateAny("user");
          if (!permission.granted) {
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
          });

          res.redirect("/admin/manage-users");
     } catch (error) {
          next(error);
     }
};
exports.postAddUser = async (req, res, next) => {
     const data = req.body;

     const newUser = {
          fname: data.fname,
          lname: data.lname,
          nickname: data.nickname,
          username: data.username,
          role: Mongoose.Types.ObjectId(data.role),
     };

     const user = req.session.user;

     try {
          const permission = ac().can(user.role.name).updateAny("user");
          if (!permission.granted) {
               const error = new Error("Not Permitted");
               error.statusCode = 403;
               throw error;
          }

          const userData = await User.findOne({ username: newUser.username });
          //just in case Userdata is deleted before the submission is done
          if (userData) {
               const error = new Error("User already in database");
               error.statusCode = 400;
               throw error;
          }

          const newUserData = new User(newUser);
          newUserData.save().then(addedUser=>{
               res.redirect("/admin/manage-users");
          });

     } catch (error) {
          next(error);
     }
};

exports.getAddUser = async (req, res, next) => {
     const user = req.session.user;
     //check if the user exists and throw error if not
     try {
          const permission = ac().can(user.role.name).createAny("user");

          if (!permission.granted) {
               const error = new Error("Not Permitted");
               error.statusCode = 403;
               throw error;
          }
          const roles = await Role.find();
          console.log(roles)
          res.render("admin/add-user", {
              
               title: "Edit User",
               roles:roles
          });
     } catch (err) {
          next(err);
     }
};

exports.getEditUser = async (req, res, next) => {
     const editableUsername = req.params.username;
     const user = req.session.user;
     //check if the user exists and throw error if not
     try {
          const permission = ac().can(user.role.name).readAny("user");

          if (!permission.granted) {
               const error = new Error("Not Permitted");
               error.statusCode = 403;
               throw error;
          }
          const editableUser = await (await User.findOne({ username: editableUsername }))
               .populate("role")
               .execPopulate();
          if (!editableUser) {
               const error = new Error("No such user");
               error.statusCode = 400;
               throw error;
          }
          const roles = await Role.find();
          console.log(roles)
          res.render("admin/edit-user", {
               editableUser: editableUser,

               title: "Edit User",
               roles:roles
          });
     } catch (err) {
          next(err);
     }
};
exports.postDeleteUser = async (req, res, next) => {
     const deletableUserName = req.params.username;
     const user = req.session.user;
     //check if the user exists and throw error if not
     try {
          const permission = ac().can(user.role.name).deleteAny("user");
          if (!permission.granted) {
               const error = new Error("Not Permitted");
               error.statusCode = 403;
               throw error;
          }
          const deletableUser = await User.findOne({ username: deletableUserName });
          if (!deletableUser) {
               const error = new Error("No such user");
               error.statusCode = 400;
               throw error;
          }
          deletableUser.delete();
          res.redirect("/admin/manage-users");
     } catch (err) {
          next(err);
     }
};

exports.postBanUser = async (req, res, next) => {};

exports.getManageUsers = async (req, res, next) => {
     const user = req.session.user;
     const currentPage = Number(req.query.page || 1);

     //get a list of all users available
     //USE PAGINATION, for large lists of user
     try {
          const perms = ac().can(user.role.name);

          if (!perms.readAny("user").granted) {
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
               .limit(pageSize)
               .populate("role")
               .exec();

          // const populatedUserslist =     userslist.map(async (user) => {
          //      return await user.populate("role").execPopulate();
          // });
          // well apparently above cannot work because its an async function inside a synchronous one.
          //I'll try something else below.

          console.log(userslist);
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
