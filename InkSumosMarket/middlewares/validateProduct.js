function validateProduct(req, res, next) {
    const errores = [];
    const productoNormalizado = {
        nombre: req.body.nombre?.trim() || "",
        descripcion: req.body.descripcion?.trim() || "",
        precio: Number(req.body.precio),
        stock: Number(req.body.stock),
        imagen: req.file
            ? `/images/products/${req.file.filename}`
            : req.body.imagenActual?.trim() || "",
        categoria_id: Number(req.body.categoria_id)
    };
    //Destructuracion
    const { nombre, descripcion, precio, stock, imagen, categoria_id } = productoNormalizado;
    if (!nombre || nombre.length < 3) {
        errores.push("Nombre inválido");
    }
    if (/^\d+$/.test(nombre)) {
        errores.push("El nombre no puede contener solo números");
    }
    if (nombre.length > 100) {
        errores.push("El nombre no puede superar los 100 caracteres");
    }
    if (!descripcion || descripcion.length < 10) {
        errores.push("Descripción inválida");
    }
    if (descripcion.length > 500) {
        errores.push("La descripción no puede superar los 500 caracteres");
    }
    if (Number.isNaN(precio) || precio <= 0) {
        errores.push("Precio inválido");
    }
    if (!Number.isInteger(stock) || stock < 0) {
        errores.push("Stock inválido");
    }
    if (!imagen) {
        errores.push("Debe ingresar una imagen");
    }
    const categoriasValidas = [1,2];
    if (!Number.isInteger(categoria_id) ||
            !categoriasValidas.includes(categoria_id)) {
        errores.push("Categoría inválida");
    }
    if (errores.length > 0) {
        console.log(`Total de errores detectados: ${errores.length}`);
        // Si Multer subió un archivo pero la validación falló, lo borramos del disco ---
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error al eliminar archivo temporal huérfano:", err);
            });
        }

        return res.status(400).render("form", {
            producto: {
                id: req.params.id,
                ...req.body,
                imagen: req.body.imagenActual?.trim() || ""
            },
            errores
        });
    }
    req.productoNormalizado = productoNormalizado;
    next();
}

module.exports = validateProduct;