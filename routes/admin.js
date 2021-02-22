// set up router
const router = require("express").Router();
const controller = require("../controllers/admin");
const isAdmin = require("../middlewares/isAdmin");
const isAuth = require("../middlewares/isAuth");
// add admin routes here
router.get("/manage-users", isAuth, controller.getManageUsers);

router.get("/edit-user/:username", isAuth, controller.getEditUser);

router.post("/delete-user/:username", isAuth, controller.postDeleteUser);

router.post("/ban-user/:username", isAuth, controller.postBanUser);

router.post("/update-user", isAuth, controller.postEditUser);

router.post("/delete-user", isAuth, controller.postDeleteUser);

router.post("/ban-user", isAuth, controller.postBanUser);

//export this route
module.exports = router;
