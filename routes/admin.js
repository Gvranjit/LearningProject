// set up router
const router = require("express").Router();
const controller = require("../controllers/admin");
const isAuth = require("../middlewares/isAuth");
// add admin routes here
router.get("/manage-users", isAuth, controller.getManageUsers);
//export this route
module.exports = router;
