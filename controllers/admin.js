//imports

const User = require("../models/user");
const pageSize = 3;
exports.getManageUsers = async (req, res, next) => {
     const user = req.session.user;
     const currentPage = req.body.currentPage;

     //get a list of all users available
     //USE PAGINATION, for large lists of user
     try {
          const totalUsers = await User.count();
          //calculate the no. of pages
          const pages = Math.ceil(totalUsers / pageSize);

          const userslist = await User.find().limit(pageSize).skip();

          res.render("admin/manage-users", {
               title: "Manage Users",
               username: user.fname,
               users: userslist,
               pageSize: pageSize,
               pages: pages,
          });
     } catch (err) {
          next(err);
     }
};
