// set up router
const router = require("express").Router();
const controller = require("../controllers/user.js");
// add user routes here
router.get("/home", controller.getUserHome);
//export this route
module.exports = router;
