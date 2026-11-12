const params = new URLSearchParams(window.location.search);
const ids = params.get("ids");

const formatoFecha = (valor) => {
    const fecha = new Date(valor);
    return Number.isNaN(fecha.getTime()) ? valor : fecha.toLocaleString();
};

const formatoMoneda = (valor) => {
    const numero = Number(valor);
    // Si no es un número válido, devolvemos "$ 0,00" como valor por defecto
    if (Number.isNaN(numero)) {
        return "$ 0,00";
    }
    // Formateamos directamente como moneda ARS
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numero);
}

window.backToHome = () => {
    sessionStorage.clear();
    window.location.href = "./index.html";
};

const cargarTicket = async () => {
    try {
        const query = ids ? `?ids=${encodeURIComponent(ids)}` : "";
        const res = await fetch(`/ticket/data${query}`);
        if (!res.ok) {
            console.error("Error al cargar el ticket:", res.status, res.statusText);
            throw new Error("No se pudo cargar el ticket");
        }
        const ticket = await res.json();
        document.getElementById("idTicket").textContent = ticket.idticket;
        document.getElementById("purchaseDate").textContent = formatoFecha(ticket.fechaCompra);
        document.getElementById("clientName").textContent = ticket.cliente || "No disponible";
        document.getElementById("paymentMethod").textContent = ticket.medioPago || "No disponible";
        let totalRender = Number(ticket.totalCompra) || 0;
        const tbody = document.getElementById("productsTable");
        tbody.innerHTML = "";
        (ticket.productos || []).forEach((producto) => {
            const tr = document.createElement("tr");
            const nombre = producto.nombre || "No disponible";
            const precio = Number(producto.precio) || 0;
            const cantidad = Number(producto.cantidad) || 0;
            const total = Number(producto.total) || (precio * cantidad);
            totalRender += total;
            tr.innerHTML = `
                <td>${nombre}</td>
                <td>${cantidad}</td>
                <td>${formatoMoneda(precio)}</td>
                <td>${formatoMoneda(total)}</td>
            `;
            tbody.appendChild(tr);
        });
        if ((Number(ticket.totalCompra) || 0) > 0) {
            totalRender = Number(ticket.totalCompra);
        }
        document.getElementById("totalAmount").textContent = formatoMoneda(totalRender);
        const link = document.getElementById("descargarLink");
        link.href = `/ticket/pdf?ids=${ticket.idticket}`;
        link.classList.remove("hidden");
    } catch (error) {
        document.body.insertAdjacentHTML("beforeend", `<p>${error.message}</p>`);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    await cargarTicket();
});