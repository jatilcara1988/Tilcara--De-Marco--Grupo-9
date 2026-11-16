// 1. Estado Global de la aplicación
let arrayData = []; // Copia de los datos de productos del Servidor, para filtrar y paginar sin hacer otra petición

const estadoPaginacion = {
    insumos: { paginaActual: 1, productosPorPagina: 3 },
    repuestos: { paginaActual: 1, productosPorPagina: 3 }
};

// 2. Petición Asíncrona original a tu Backend/API
const obtenerProductos = async () => {
    try {
        console.log("Iniciando petición a la API para obtener productos...");
        let respuesta = await fetch("/products");
        console.log("Respuesta de la API recibida:", respuesta);
        if (!respuesta.ok) {
            console.log("Error en la respuesta de la API:", respuesta.status);
            switch (respuesta.status) {
                case 400:
                    throw new Error("Solicitud incorrecta");
                default:
                    throw new Error(`Error ${respuesta.status}`);
            }
        }
        let datos = await respuesta.json();
        arrayData = [...datos]; // Guardamos los productos reales detectados
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
};

// 3. Función unificada que divide por categoría y aplica Paginación
function renderizarSeccion(categoria) {
    console.log(`Renderizando sección para la categoría: ${categoria}`);
    // Armar dinámicamente los IDs que coinciden con tu HTML
    const idContenedor = `contenedor${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`;
    const idPaginacion = `paginacion${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`;

    const contenedor = document.getElementById(idContenedor);
    const contenedorPag = document.getElementById(idPaginacion);

    //Muestro solo la seccion actual
    const seccion = contenedor.closest("section");
    seccion.classList.remove("contentHidden");

    if (!contenedor || !contenedorPag) return;

    // 1. FILTRAR: Tomar del array global solo los de la categoría correspondiente
    // Nota: Asegúrate de que en tu base de datos el campo se llame exactamente "seguridad" o "productividad"
    const productosFiltrados = arrayData.filter(p => {
        // Verificamos que el producto y su categoria_id existan
        if (p && p.categoryId !== undefined && p.categoryId !== null) {
            
            // Si la sección que estamos renderizando es "insumos", buscamos el ID 1
            if (categoria === "insumos") {
                return Number(p.categoryId) === 1;
            }
            
            // Si la sección es "repuestos", buscamos el ID 2
            if (categoria === "repuestos") {
                return Number(p.categoryId) === 2;
            }
        }
        return false;
    });
    console.log(`Productos filtrados para la categoría ${categoria}:`, productosFiltrados.length);
    // 2. PAGINAR: Calcular cortes (Slice)
    const config = estadoPaginacion[categoria];
    const indiceInicio = (config.paginaActual - 1) * config.productosPorPagina;
    const indiceFin = indiceInicio + config.productosPorPagina;
    const productosPagina = productosFiltrados.slice(indiceInicio, indiceFin);

    // 3. DIBUJAR: Estructura de tarjetas (Usando tus clases de Bootstrap y propiedades)
    contenedor.innerHTML = `<div class="row g-4" id="grid-${categoria}"></div>`;
    const grid = document.getElementById(`grid-${categoria}`);

    if (productosPagina.length === 0) {
        grid.innerHTML = `<p class="text-muted text-center col-12">No hay productos en esta categoría.</p>`;
        return;
    }

    productosPagina.forEach(producto => {
        // Lógica del carrito con sessionStorage
        const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
        const existeEnCarrito = carrito.some(item => item.id === producto.id);
        grid.innerHTML += `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card card-product h-100 shadow-sm">
                <img src="${producto.productImage}" class="card-img-top image-product p-3" alt="Imagen de ${producto.productName}" style="max-height: 180px; object-fit: contain;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fs-6 fw-bold">${producto.productName}</h5>
                    <p class="card-text small description-product">${producto.productDescription}</p>
                    <h4 class="price-product mt-auto mb-3">
                        ${
                            new Intl.NumberFormat('es-AR', {
                                style: 'currency',
                                currency: 'ARS',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }).format(producto.price)
                        }
                    </h4>
                    <div class="mt-2">
                        ${existeEnCarrito ? 
                            `<button class="btn btn-danger btn-sm w-100" onclick="dropFromCart(${producto.id}, '${categoria}')">Quitar del carrito</button>` : 
                            `<button class="btn btn-primary btn-sm w-100 btn-carrito" onclick="addToCart(${producto.id}, '${categoria}')">Agregar al carrito</button>`
                        }
                    </div>
                </div>
            </div>
        </div>`;
    });
    // 4. BOTONERA: Dibujar la paginación de esta sección
    renderizarBotoneraSeccion(categoria, productosFiltrados.length, contenedorPag);
}



// 4. Generador dinámico de botones numéricos
function renderizarBotoneraSeccion(categoria, totalItems, contenedorPag) {
    const config = estadoPaginacion[categoria];
    const totalPaginas = Math.ceil(totalItems / config.productosPorPagina);
    contenedorPag.innerHTML = "";

    if (totalPaginas <= 1) return;

    let navHTML = `<nav><ul class="pagination pagination-sm justify-content-center mt-5">`;

    // Anterior
    navHTML += `
        <li class="page-item ${config.paginaActual === 1 ? 'disabled' : ''}">
            <button class="page-link" onclick="cambiarPaginaSeccion('${categoria}', ${config.paginaActual - 1})">Anterior</button>
        </li>
    `;

    // Números
    for (let i = 1; i <= totalPaginas; i++) {
        navHTML += `
            <li class="page-item ${config.paginaActual === i ? 'active' : ''}">
                <button class="page-link" onclick="cambiarPaginaSeccion('${categoria}', ${i})">${i}</button>
            </li>
        `;
    }

    // Siguiente
    navHTML += `
        <li class="page-item ${config.paginaActual === totalPaginas ? 'disabled' : ''} ">
            <button class="page-link" onclick="cambiarPaginaSeccion('${categoria}', ${config.paginaActual + 1})">Siguiente</button>
        </li>
    `;

    navHTML += `</ul></nav>`;
    contenedorPag.innerHTML = navHTML;
}

// 5. Controladores de eventos expuestos a 'window' para los onclick inline
window.cambiarPaginaSeccion = function(categoria, nuevaPagina) {
    estadoPaginacion[categoria].paginaActual = nuevaPagina;
    renderizarSeccion(categoria);
};

window.addToCart = function(idProducto, categoria) {
    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    const producto = arrayData.find(p => p.id === idProducto);
    
    if (producto && !carrito.some(item => item.id === idProducto)) {
        // Agregamos el producto y el atributo quantity
        carrito.push({...producto, quantity : 1});
        sessionStorage.setItem("carrito", JSON.stringify(carrito));
    }
    renderizarSeccion(categoria);
};

window.dropFromCart = function(idProducto, categoria) {
    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    carrito = carrito.filter(item => item.id !== idProducto);
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    
    renderizarSeccion(categoria);
};

window.backToHome = () => {
    sessionStorage.clear();
    window.location.href = "./index.html";
}

// 6. Listener de arranque DOMContentLoaded (Tu lógica de inicio preservada)
document.addEventListener("DOMContentLoaded", async () => {
    
    // Validar sesión del cliente
    const nombre = sessionStorage.getItem("cliente");
    if (!nombre) {
        window.location.href = "./index.html";
        return; // Detiene la ejecución si no está logueado
    }

    console.log(`Cliente logueado: ${nombre}`);
    console.log("Estado inicial de paginación:", estadoPaginacion);
    console.log("Array de productos inicial:", arrayData);
    // Traer los datos desde la API
    await obtenerProductos();
    console.log("Array de productos después de la petición:", arrayData);

    //Escucha clicks en cualquier elemento que tenga data-categoria (Cards y botones en menu)
    document.addEventListener("click", (e) => {
        const elemento = e.target.closest("[data-categoria]");
        if(!elemento) return;
        console.log(`Se ha hecho click en la categoría: ${elemento.dataset.categoria}`);

        // Ocultar todas las secciones antes de renderizar nuevamente
        document.querySelectorAll(".category-section").forEach(seccion => {
            console.log(`Ocultando sección: ${seccion.querySelector("h2").textContent}`);
            seccion.classList.add("contentHidden");
        });
        //Mostramos la categoria seleccionada
        let categoria = elemento.dataset.categoria;
        renderizarSeccion(categoria);
    });



// Se manejan Clicks en categorias

    document.addEventListener("click", (e) => {
    const elemento = e.target.closest("[data-categoria]");
    if(!elemento) return;
    
    // Mostramos el botón de volver cuando entra a la categoría
    const botonVolver = document.getElementById('btn-volver');
    if (botonVolver) {
        botonVolver.style.display = 'block'; // Lo hace visible
    }
    // Oculta todas las secciones de la página (incluido el menú principal)
    // para dejar la pantalla limpia antes de cargar los productos
    document.querySelectorAll(".category-section").forEach(seccion => {
        seccion.classList.add("contentHidden");
    });
    //Se dibujan los elementos de categoria 
    let categoria = elemento.dataset.categoria;
    renderizarSeccion(categoria);
});



// Btn volver dentro de repuestos e insumos, mostrar como estaba original


const botonVolver = document.getElementById('btn-volver');

if (botonVolver) {
    botonVolver.style.display = 'none'; 

    botonVolver.addEventListener('click', function() {
        // 1. Ocultar el botón "Volver"
        botonVolver.style.display = 'none';

        // 2. Ocultar TODAS las secciones de un solo golpe (igual que en el bloque 1)
        document.querySelectorAll(".category-section").forEach(seccion => {
            seccion.classList.add("contentHidden");
        });

        // 3. Volver a mostrar SOLO el menú principal
        const menuPrincipal = document.getElementById('menu-principal');
        if (menuPrincipal) {
            menuPrincipal.classList.remove("contentHidden");
        }

        // 4. Limpiar todos los contenedores usando un array (chau a las líneas repetidas)
        const elementosALimpiar = [
            'contenedorInsumos', 
            'contenedorRepuestos', 
            'paginacionInsumos', 
            'paginacionRepuestos'
        ];
        
        elementosALimpiar.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) elemento.innerHTML = ''; 
        });
    });
}

});