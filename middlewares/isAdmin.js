module.exports = (req, res, next) => {
     console.log("passed through isAuth middleware");
     try {
          if (!req.session.user.isAdmin) {
               const error = new Error("Forbidden");
               error.statusCode = 403;
               throw error;
          }
          next();
     } catch (err) {
          next(err);
     }

     //test
};
