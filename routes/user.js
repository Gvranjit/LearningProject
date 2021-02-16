// set up router
const router = require("express").Router();
const controller = require("../controllers/user.js");
const isAuth = require("../middlewares/isAuth.js");
// add user routes here
router.get("/home", isAuth, controller.getUserHome);
//export this route
module.exports = router;
