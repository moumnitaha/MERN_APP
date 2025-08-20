const authController = require("./modules/auth/auth.controller");
const productsController = require("./modules/products/product.controller.js");
const express = require("express");
const path = require("path");
const router = express.Router();

const authenticateToken = require("./modules/auth/validators/tokenValidator.js");
const loginValidator = require("./modules/users/validators/loginValidator");
const signupValidator = require("./modules/users/validators/signupValidator");
const updateInfosValidator = require("./modules/users/validators/updateInfosValidator");
const changePassValidator = require("./modules/users/validators/changePassValidator");
const {
  productValidator,
} = require("./modules/products/validators/productValidator.js");

const productRoutes = require("./modules/products/product.routes.js");
const orderRoutes = require("./modules/orders/order.routes.js");
const userRoutes = require("./modules/users/user.routes.js");
const categoryRoutes = require("./modules/categories/category.routes.js");
const authRoutes = require("./modules/auth/auth.routes.js");
const ordersController = require("./modules/orders/order.controller");

const meController = require("./modules/users/me.controller.js");
const { refresh } = require("./modules/auth/refresh.controller.js");
const usersController = require("./modules/users/user.controller.js");

router.post("/logout", authController.logout);
router.post("/login", loginValidator, authController.login);
router.post("/signup", signupValidator, authController.signup);
router.get("/verify", authController.verify);

router.delete(
  "/deleteProduct",
  authenticateToken,
  productsController.deleteProduct
);
router.get("/", (req, res) =>
  res.status(200).send({ message: "Welcome to the backend" })
);
router.post(
  "/addProduct",
  authenticateToken,
  productValidator,
  productsController.addProduct
);
router.use("/auth", authRoutes);
router.get("/me", authenticateToken, meController.me);
router.use("/users", authenticateToken, userRoutes);
router.use("/products", authenticateToken, productRoutes);
router.use("/orders", authenticateToken, orderRoutes);

// Legacy route for backward compatibility with old frontend
router.post("/addOrder", authenticateToken, ordersController.addOrder);
router.use("/categories", authenticateToken, categoryRoutes);
router.post("/refresh", refresh);
router.put(
  "/updateInfos",
  authenticateToken,
  updateInfosValidator,
  usersController.updateInfos
);
router.put(
  "/updateProduct",
  authenticateToken,
  productValidator,
  productsController.updateProduct
);
router.put(
  "/changePass",
  authenticateToken,
  changePassValidator,
  usersController.changePass
);
router.post("/upload_avatar", authenticateToken, usersController.uploadAvatar);
router.use(
  "/uploads",
  express.static(path.join(__dirname, "modules/../uploads"))
);

module.exports = router;
