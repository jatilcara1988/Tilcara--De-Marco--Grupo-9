const db = require("../models/init");

const salesController = { 
    // 1. Método original para tu vista EJS (no lo tocamos)
    findAllSales : async (req, res) => {
        try {
            const ventas = await db.sales.findAll({
                attributes: ["id", "clientName", "total", "saleMethod", "sellDate"],
                include: [
                    {
                        model: db.salesDetails,
                        as: "salesDetails",
                        attributes: ["quantity"],
                        include: [
                            {
                                model: db.products,
                                as: "product",
                                attributes: ["productName"]
                            }
                        ]
                    }
                ],
                order: [["sellDate", "DESC"]]
            });
            const ventasFormateadas = ventas.map(venta => ({
                id: venta.id,
                nombre_cliente: venta.clientName,
                total: venta.total,
                medio: venta.saleMethod,
                fecha: venta.sellDate && !isNaN(new Date(venta.sellDate).getTime()) 
                        ? new Date(venta.sellDate).toISOString() : null,
                productos: venta.salesDetails && Array.isArray(venta.salesDetails)
                    ? venta.salesDetails.map(detalle => {
                        const nombreProd = detalle.product?.productName || "Producto sin nombre";
                        const cantidad = detalle.quantity || 1;
                        return `${nombreProd} x ${cantidad}`;
                      })
                    : []
            }));
            res.render("sales", {
                ventasFormateadas
            });
        } catch(error){
            console.log(error);
            res.status(500).send("Error al obtener ventas");
        }
    },

    // 2.Método exclusivo para la API
    findAllSalesJSON : async (req, res) => {
        try {
            const ventas = await db.sales.findAll({
                attributes: ["id", "clientName", "total", "saleMethod", "sellDate"],
                include: [
                    {
                        model: db.salesDetails,
                        as: "salesDetails",
                        attributes: ["quantity"],
                        include: [
                            {
                                model: db.products,
                                as: "product",
                                attributes: ["productName"]
                            }
                        ]
                    }
                ],
                order: [["sellDate", "DESC"]]
            });
            const ventasFormateadas = ventas.map(venta => ({
                id: venta.id,
                nombre_cliente: venta.clientName,
                total: venta.total,
                medio: venta.saleMethod,
                fecha: venta.sellDate && !isNaN(new Date(venta.sellDate).getTime()) 
                        ? new Date(venta.sellDate).toISOString() : null,
                productos: venta.salesDetails && Array.isArray(venta.salesDetails)
                    ? venta.salesDetails.map(detalle => {
                        const nombreProd = detalle.product?.productName || "Producto sin nombre";
                        const cantidad = detalle.quantity || 1;
                        return `${nombreProd} x ${cantidad}`;
                      })
                    : []
            }));
            
            // Acá devolvemos JSON puro
            res.status(200).json(ventasFormateadas);

        } catch(error){
            console.log(error);
            res.status(500).json({ mensaje: "Error al obtener ventas" });
        }
    }
};

module.exports = salesController;