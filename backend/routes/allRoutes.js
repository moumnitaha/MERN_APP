const express = require("express");
const router = express.Router();
const { login } = require("../controllers/login.js");
const { signup } = require("../controllers/signup.js");
const { logout } = require("../controllers/logout.js");
const { verify } = require("../controllers/verifyEmail.js");
const { refresh } = require("./refresh");
const { friendship } = require("../controllers/friendship.js");
const { upload_avatar } = require("./uploadAvatar");
const products = require("./products");
const { addProduct } = require("./addProduct");
const { updateProduct } = require("./updateProduct");
const { deleteProduct } = require("./deleteProduct");
const { me } = require("./me");
const { users } = require("./users");
const authenticateToken = require("../middleware/tokenMiddleWare");
const path = require("path");
const {
  loginValidator,
  signupValidator,
} = require("../middleware/authMiddleware");

const { productValidator } = require("../middleware/productMiddleware.js");

router.post("/login", loginValidator, login);
router.post("/signup", signupValidator, signup);
router.get("/verify", verify);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/upload_avatar", authenticateToken, upload_avatar);
router.get("/me", authenticateToken, me);
router.post("/addFriend", authenticateToken, friendship);
router.get("/users", authenticateToken, users);
router.get("/products", authenticateToken, products);
router.post("/addProduct", authenticateToken, productValidator, addProduct);
router.delete(
  "/deleteProduct",
  authenticateToken,
  productValidator,
  deleteProduct
);
router.put(
  "/updateProduct",
  authenticateToken,
  productValidator,
  updateProduct
);
router.use(
  "/uploads",
  authenticateToken,
  express.static(path.join(__dirname, "../uploads"))
);

module.exports = router;
