module.exports = (req, res, next) => {
     console.log("passed through isAuth middleware");
     try {
          if (!req.session.isLoggedIn) {
               const error = new Error("Not Authenticated");
               error.statusCode = 401;
               throw error;
          }
          next();
     } catch (err) {
          next(err);
     }

     //test
};
