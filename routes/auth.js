// set up router
const router = require("express").Router();

//imports
const controllers = require("../controllers/auth");

// add auth routes here
router.get("/", controllers.login);

//export this route
module.exports = router;
