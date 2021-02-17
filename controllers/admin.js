//imports

const User = require("../models/user");
const pageSize = 3;
exports.getManageUsers = async (req, res, next) => {
     const user = req.session.user;
     const currentPage = Number(req.query.page || 1);

     //get a list of all users available
     //USE PAGINATION, for large lists of user
     try {
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
