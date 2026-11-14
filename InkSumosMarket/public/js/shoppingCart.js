const obtenerCarrito = () => {
    try {
        const carrito = JSON.parse(sessionStorage.getItem("carrito"));
        return Array.isArray(carrito) ? carrito : [];
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        return [];
    }
};

const guardarCarrito = (carrito) => {
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
};

const obtenerClienteGuardado = () => {
    return (sessionStorage.getItem("cliente") || "").trim();
};

const quitarDelCarrito = (id) => {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(producto => producto.id !== id);
    guardarCarrito(carrito);
    renderizarCarrito(carrito);
}

const renderizarCarrito = (productos) => {
    const contenedor = document.querySelector("#container-shopping-cart");
    contenedor.innerHTML = "";
    //Renderizo si hay productos
    if (productos.length !== 0){
        let html = "";
        productos.forEach(producto => {
            html += `
            <div class="card card-shopping-cart mb-3 shadow-sm mx-auto" style="max-width: 900px;">
                <div class="row g-0 align-items-center">
                    <div class="col-md-2 text-center p-2">
                        <img src="${producto.productImage}"
                            class="img-fluid rounded"
                            alt="Producto">
                    </div>
                    <div class="col-md-5">
                        <div class="card-body">
                            <h5 class="card-title">${producto.productName}</h5>
                            <p class="fw-bold mb-0">
                                $ ${producto.price}
                            </p>
                        </div>
                    </div>
                    <div class="col-md-2 text-center">
                        <label class="form-label">Cantidad</label>
                        <input type="number"
                            class="form-control w-75 mx-auto cantidad-producto"
                            min="1"
                            value="${producto.quantity}"
                            data-id="${producto.id}">
                    </div>
                    <!-- Subtotal y eliminar -->
                    <div class="col-md-2 text-center">
                        <label class="form-label">Subtotal</label>
                        <p class="subtotal fw-bold">
                            $ ${
                                new Intl.NumberFormat('es-AR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }).format(producto.quantity * producto.price)
                            }
                        </p>
                    </div>
                    <div class="col-md-1 text-center">
                        <button class="btn btn-danger btn-sm"
                            onclick="quitarDelCarrito(${producto.id})">
                            Quitar
                        </button>
                    </div>
                </div>
            </div>`
        });
        contenedor.innerHTML = html;
        renderizarTotal(productos);

    } else {
        console.log("carrito vacio");
        contenedor.innerHTML = `
        <div class="carrito-vacio w-100 text-center mt-5">
            <h3>No hay productos en el carrito</h3>
            <p >Agregá productos para comenzar tu compra.</p>
        </div>
        `;
        renderizarTotal([]);
    }

}

const calcularTotal = (carrito) =>{
    return carrito.reduce((total, producto) => {
        return total + (producto.price * producto.quantity);
    }, 0);
}

const renderizarTotal = (carrito) => {
    const contenedorTotal = document.querySelector("#total-carrito");
    if (carrito.length !== 0) {
        const total = calcularTotal(carrito);
        contenedorTotal.innerHTML = `
            <div class="card card-total shadow-sm mx-auto mt-4" style="max-width: 900px;">
                <div class="card-body d-flex justify-content-end">
                    <div class="d-flex justify-content-end align-items-center gap-3">
                        <h4 class="mb-0">
                            Total: 
                            <span class="total-precio">
                            ${
                                new Intl.NumberFormat('es-AR', {
                                    style: 'currency',
                                    currency: 'ARS',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }).format(total)
                            }
                            </span>
                        </h4>
                        <button
                            class="btn btn-success btn-lg"
                            onclick="abrirModal()">
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        contenedorTotal.innerHTML = "";
    }
};

const modal = document.getElementById("modal-confirmation");

//Controladores de eventos expuestos a 'window' para los onclick inline
window.backToHome = () => {
    sessionStorage.clear();
    window.location.href = "index.html";
}

window.quitarDelCarrito = quitarDelCarrito;

window.abrirModal = () => {
    const nombreClienteInput = document.getElementById("nombre-cliente");
    const clienteGuardado = obtenerClienteGuardado();
    if (nombreClienteInput && !nombreClienteInput.value.trim() && clienteGuardado) {
        nombreClienteInput.value = clienteGuardado;
    }
    modal.classList.add("modal-visible");
    modal.classList.remove("modal-hidden");
};

window.cancelPurchase = () => {
    modal.classList.add("modal-hidden");
    modal.classList.remove("modal-visible");
}

window.confirmPurchase = async () => {
    const carrito = obtenerCarrito();
    const clienteGuardado = obtenerClienteGuardado();
    const nombreClienteInput = document.getElementById("nombre-cliente");
    const medioPagoSelect = document.getElementById("medio-pago");
    const nombreCliente = nombreClienteInput ? nombreClienteInput.value.trim() || clienteGuardado : clienteGuardado;
    const medioPago = medioPagoSelect ? medioPagoSelect.value : "";
    if (!Array.isArray(carrito) || carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }
    if (!nombreCliente) {
        alert("Debes ingresar el nombre del cliente");
        return;
    }
    if (nombreCliente) {
        sessionStorage.setItem("cliente", nombreCliente);
    }
    try {
        const respuesta = await fetch("/ticket/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                carrito: carrito,
                nombre_cliente: nombreCliente,
                medio: medioPago || "No especificado"
            })
        });

        if (!respuesta.ok) {
            console.error("Error en la respuesta del servidor:", respuesta);
            throw new Error("No se pudo registrar la compra");
        }
        const data = await respuesta.json();
        if (!data.saleId) {
            console.error("El servidor no devolvió un ticket válido:", data);
            throw new Error("El servidor no devolvió un ticket válido");
        }
        alert("Compra realizada con éxito");
        sessionStorage.removeItem("carrito");
        // Redirijo a pantalla ticket con el ID persistido
        window.location.href = `/ticket?ids=${data.saleId}`;
    } catch (error) {
        console.error(error);
        alert("No se pudo completar la compra. Intenta nuevamente.");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.querySelector("#container-shopping-cart");
    let carrito = obtenerCarrito();
    renderizarCarrito(carrito)
    //Uso delegados para escuchar los inputs Cantidad y renderizo si hay cambios
    contenedor.addEventListener("change", (e) => {
        if (!e.target.classList.contains("cantidad-producto")) return;

        const id = Number(e.target.dataset.id);
        const cantidad = Number(e.target.value);

        let carrito = obtenerCarrito();

        const producto = carrito.find(p => p.id === id);
        if (producto) {
            producto.quantity = Math.max(1, cantidad);
        }
        guardarCarrito(carrito);
        renderizarCarrito(carrito);
    });

/* Volever a la direccion de productos */
const btnVolverProductos = document.getElementById('btn-volver2');

if (btnVolverProductos) {
    btnVolverProductos.addEventListener('click', function() {
        
        window.location.href = '/products.html';
        
    });
}


});
