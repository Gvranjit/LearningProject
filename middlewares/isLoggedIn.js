module.exports = (req,res,next)=>{
    const loggedIn = req.session.isLoggedIn;
    if (!loggedIn) {
         res.redirect("/"); // '/' route is the login page
    }
    next();
}