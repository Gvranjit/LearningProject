// set up router
const router = require("express").Router();
const controller = require("../controllers/admin");
// add admin routes here
router.get("/manage-users", controller.getManageUsers);
//export this route
module.exports = router;
