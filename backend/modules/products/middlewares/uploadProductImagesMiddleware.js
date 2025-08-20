const multer = require("multer");
const path = require("path");
const fs = require("fs");

const tmpDir = path.join(__dirname, "../../../uploads/products/tmp");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use productId from req.body or fallback to tmp
    console.log(req.body);
    const productId = req.body.productId || "tmp";
    const productsFolder = path.join(__dirname, "../../../uploads/products");
    const productPath = path.join(productsFolder, productId.toString());
    if (!fs.existsSync(productPath)) {
      fs.mkdirSync(productPath, { recursive: true });
    }
    cb(null, productPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const productId = req.body.productId || "product";
    if (!req.fileIndex) req.fileIndex = 0;
    const newFileName = `${productId}_${req.fileIndex}${ext}`;
    req.fileIndex += 1;
    // Optionally, collect all filenames in req.uploadedProductImages
    if (!req.uploadedProductImages) req.uploadedProductImages = [];
    req.uploadedProductImages.push(newFileName);
    cb(null, newFileName);
  },
});

const uploadProductImages = multer({ storage });

module.exports = uploadProductImages;
