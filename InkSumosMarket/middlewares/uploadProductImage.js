const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/images/productos"));
    },
    filename: (req, file, cb) => {
        const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${nombreUnico}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

module.exports = upload.single("imagen");