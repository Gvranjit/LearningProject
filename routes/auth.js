// set up router
const router = require("express").Router();

//imports
const controllers = require("../controllers/auth");
const validation = require("../middlewares/validation");
// add auth routes here

router.post("/auth/register", validation.sanitizeRegistration, controllers.postRegister);

router.post("/auth/login", controllers.postLogin);

router.get("/auth/logout", controllers.getLogout);

router.get("/", controllers.getLogin);

//export this route

module.exports = router;
