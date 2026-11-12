const db = require("../models/init");
const path = require("path");
const puppeteer = require("puppeteer");

const resolverVentaId = async (idsQuery) => {
    if (idsQuery) {
        const ids = String(idsQuery)
            .split(",")
            .map((id) => Number(id))
            .filter((id) => Number.isInteger(id) && id > 0);
        if (ids.length > 0) {
            return ids[0];
        }
    }
    const ultimaVenta = await db.sales.findOne({
        order: [["sellDate", "DESC"], ["id", "DESC"]],
    });
    return ultimaVenta ? ultimaVenta.id : null;
};

const construirTicket = async (ventaId) => {
    const venta = await db.sales.findByPk(ventaId);
    if (!venta) {
        return null;
    }
    const detalles = await db.salesDetails.findAll({
        where: { saleId: ventaId },
        include: [{
            model: db.products,
            as: "product",
            attributes: ["id", "productName", "price"],
        }],
    });
    const productos = detalles.map((detalle) => {
        //const producto = detalle.product;
        return {
            id: detalle.product ? detalle.product.id : detalle.productId,
            nombre: detalle.product ? detalle.product.productName : "Sin nombre",
            precio: detalle.product ? detalle.product.price : 0,
            cantidad: detalle.quantity,
        };
    });
    const totalVenta = Number(venta.total);
    const totalCalculado = productos.reduce((acum, item) => {
        const precio = Number(item.price) || 0;
        const cantidad = Number(item.quantity) || 0;
        return acum + (precio * cantidad);
    }, 0);
    return {
        idticket: venta.id,
        fechaCompra: venta.sellDate,
        cliente: venta.clientName,
        totalCompra: totalVenta > 0 ? totalVenta : totalCalculado,
        productos,
        medioPago: venta.saleMethod,
        esVista: true,
    };
};

const ticketController = {
    generateTicket: async (req, res) => {
        try {
            const sellId = await resolverVentaId(req.query.ids);
            if (!sellId) {
                return res.status(404).send("No hay ventas para mostrar ticket");
            }
            const ticket = await construirTicket(sellId);
            if (!ticket) {
                return res.status(404).send("Venta no encontrada");
            }
            res.sendFile(path.join(__dirname, "../public/ticket.html"));
        } catch (error) {
            console.log(error);
            res.status(500).send("Error interno del servidor");
        }
    },
    
    checkoutTicket: async (req, res) => {
        const transaction = await db.sales.sequelize.transaction();
        try {
            const carrito = Array.isArray(req.body.carrito) ? req.body.carrito : [];
            const nombreCliente = (req.body.nombre_cliente || "").trim() || "Cliente Mostrador";
            const medioPago = req.body.medio || "No especificado";
            if (carrito.length === 0) {
                await transaction.rollback();
                return res.status(400).json({ error: "El carrito está vacío" });
            }
            const total = carrito.reduce((acc, item) => {
                const precio = Number(item.price !== undefined ? item.price : 0);
                const cantidad = Number(item.quantity !== undefined ? item.quantity : 1);
                return acc + (precio * cantidad);
            }, 0);
            const venta = await db.sales.create({
                clientName: nombreCliente,
                total: total,
                sellDate: new Date(),
                saleMethod: medioPago,
            }, { transaction });
            const detallePayload = carrito.map((item) => ({
                saleId: venta.id,
                productId: Number(item.id),
                quantity: Number(item.quantity) || 1,
            }));
            await db.salesDetails.bulkCreate(detallePayload, { transaction });
            await transaction.commit();
            return res.status(201).json({
                mensaje: "Compra registrada",
                saleId: venta.id,
            });
        } catch (error) {
            await transaction.rollback();
            console.error("Error al registrar checkout:", error);
            return res.status(500).json({ error: "No se pudo registrar la compra" });
        }
    },

    getTicketData: async (req, res) => {
        try {
            const ventaId = await resolverVentaId(req.query.ids);
            if (!ventaId) {
                return res.status(404).json({ error: "No hay ventas para mostrar ticket" });
            }
            const ticket = await construirTicket(ventaId);
            if (!ticket) {
                return res.status(404).json({ error: "Venta no encontrada" });
            }
            return res.json(ticket);
        } catch (error) {
            console.error("Error al obtener ticket:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    downloadTicket: async (req, res) => {
        let browser;
        try {
            const ventaId = await resolverVentaId(req.query.ids);
            if (!ventaId) {
                return res.status(404).send("No hay ventas para mostrar ticket");
            }
            const protocolo = req.get("x-forwarded-proto") || req.protocol;
            const host = req.get("host");
            const ticketUrl = `${protocolo}://${host}/ticket?ids=${ventaId}`;
            browser = await puppeteer.launch({
                headless: true,
                //args: ["--no-sandbox", "--disable-setuid-sandbox"],
            });
            const page = await browser.newPage();
            await page.goto(ticketUrl, { waitUntil: "networkidle0", timeout: 45000 });
            // Evita que el enlace de descarga se renderice dentro del PDF.
            await page.addStyleTag({ content: ".actions { display: none !important; }" });
            const pdfBuffer = await page.pdf({
                format: "A4",
                printBackground: true,
                margin: {
                    top: "20px",
                    right: "20px",
                    bottom: "20px",
                    left: "20px",
                },
            });
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=ticket-${ventaId}.pdf`);
            return res.send(pdfBuffer);
        } catch (error) {
            console.error("Error al descargar el ticket:", error);
            return res.status(500).send("Error interno del servidor");
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
};

module.exports = ticketController;
