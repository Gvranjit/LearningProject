module.exports = (req, res, next) => {
     console.log("passed through isAuth middleware");
     try {
          if (!req.session.isLoggedIn) {
               res.redirect("/");
          }

          next();
     } catch (err) {
          next(err);
     }

     //test
};
