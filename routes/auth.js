// set up router
const router = require("express").Router();

//imports
const controllers = require("../controllers/auth");

// add auth routes here
router.get("/", controllers.getLogin);

router.post("/auth/register", controllers.postRegister);

//export this route
module.exports = router;
