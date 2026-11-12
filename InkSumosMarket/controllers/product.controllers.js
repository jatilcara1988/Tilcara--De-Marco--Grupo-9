const { products } = require("../models/init");

const productController = {
    findAllProducts : async (req, res) => {
        try {
            const lstProducts = await products.findAll({
                where: {isActive: true},
                raw: true
            });
            res.status(200).json(lstProducts);
        } catch (error) {
            console.error(error);
            res.status(500).json({mensaje: "Error al obtener productos"});
        }
    },
    formUpdateProduct : async (req, res) => {
        try {
            const product = await products.findByPk(req.params.id);
            if (!product) {
                return res.status(404).send("Producto no encontrado");
            }
            return res.render("form", {
                producto: product,
                errores: []
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send("Error interno");
        }
    },
    formCreateProduct : (req, res) => {
        res.render("form", {
            producto: null,
            errores: []
        });
    },
    updateProduct: async (req, res) => {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).send("ID inválido");
            }
            const product = await products.findByPk(id);
            if (!product) {
                return res.status(404).send("Producto no encontrado");
            }
            const data = req.productoNormalizado; 
            await product.update({
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                stock: data.stock,
                imagen: data.imagen
            });
            return res.redirect("/admin/dashboard");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Error interno");
        }
    },
    createProduct: async (req, res) => {
        try {
            const productNuevo = await products.create(
                req.productoNormalizado
            );
            return res.redirect("/admin/dashboard");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Error interno");
        }
    },
    deleteProduct: async (req, res) => {
        await activateOrDesactivate(req, res, false);
    },
    reactivateProduct: async (req, res) => {
        await activateOrDesactivate(req, res, true);
    }
};
                
const activateOrDesactivate = async (req, res, activate) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "ID inválido"
            });
        }
        const product = await products.findByPk(id);
        if (!product) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }
        if (product.isActive === activate) {
            return res.status(200).json({
                mensaje: activate ? "El producto ya está activo" : "El producto ya está inactivo"
            });
        }
        await product.update({ isActive: activate });
        return res.status(200).json({
            mensaje: activate ? "Producto activado" : "Producto desactivado"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: "Error interno"
        });
    }
};

module.exports = productController;