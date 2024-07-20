const router = require("express").Router();

const { userValidate, vaidateEdit, vaidatePassword, validatePost } = require("../middlewares/userValidater");
const userAuth = require("../middlewares/userAuth");
const { changePassword, editUser, fetchUser, login, signup, changeProfileImage} = require("../controller/user/userController");



router.post("/signup", signup);

router.post("/login", login)

router.get("/fetch-user", userAuth, fetchUser)

router.post("/edit", userAuth, vaidateEdit,editUser)

router.post("/change-pass", userAuth, vaidatePassword, changePassword)

router.post("/change-image",userAuth, changeProfileImage)



module.exports = router;
