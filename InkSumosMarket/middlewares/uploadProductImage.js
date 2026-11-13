const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/images/products"));
    },
    filename: (req, file, cb) => {
        const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        console.log(`Nombre generado para el archivo: ${nombreUnico}`);
        cb(null, `${nombreUnico}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

module.exports = upload.single("imagen");