exports.getUserHome = (req, res, next) => {
     const loggedIn = req.session.isLoggedIn;
     if (!loggedIn) {
          res.redirect("/");
     }
     const user = req.session.user;
     res.render("home", { title: "Home", username: user.fname });
};
