window.backToHome = () => {
    //window.location.href = "/";
    window.location.href = "/auth/logout";
};

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const aviso = document.getElementById("avisoError");
    form.addEventListener("input", () => {
        aviso.innerText = "";
        aviso.classList.add("d-none");
    });
    form.addEventListener("submit", (e) => {
        aviso.innerText = "";
        const error = validarProducto(form);
        if (error) {
            e.preventDefault();
            aviso.innerText = error;
            aviso.classList.remove("d-none");
        }
    });
});

function validarProducto(form) {
    const nombre = form.nombre.value.trim();
    const descripcion = form.descripcion.value.trim();
    const precio = Number(form.precio.value);
    const stock = Number(form.stock.value);
    if (nombre.length < 3) {
        e.preventDefault();
        aviso.innerText = "El nombre debe tener al menos 3 caracteres";
        return;
    }
    if (/^\d+$/.test(nombre)) {
        return "El nombre no puede contener solo números";
    }
    if (descripcion.length < 10) {
        return "La descripción debe tener al menos 10 caracteres";
    }
    if (/^\d+$/.test(descripcion)) {
        return "La descripción no puede contener solo números";
    }
    if (precio <= 0) {
        return "El precio debe ser mayor a 0";
    }
    if (!Number.isInteger(stock) || stock < 0) {
        return "El stock debe ser un número entero mayor o igual a 0";
    }
    return null;
};


