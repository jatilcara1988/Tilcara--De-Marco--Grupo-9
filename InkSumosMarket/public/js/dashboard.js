window.backToHome = () => {
    window.location.href = "/auth/logout";
}

document.addEventListener("click", (e) => {
    const botonEditar = e.target.closest(".btn-editar");
    const botonEliminar = e.target.closest(".btn-eliminar");
    const botonReactivar = e.target.closest(".btn-reactivar");

    if (!botonEliminar && !botonReactivar && !botonEditar) {
        return;
    }

    const id = botonEliminar ? botonEliminar.dataset.id : ( botonEditar ? botonEditar.dataset.id : botonReactivar.dataset.id);
    const productName = botonEliminar ? botonEliminar.dataset.name : ( botonEditar ? botonEditar.dataset.name : botonReactivar.dataset.name);

    if (!id) {
        alert("No se encontró el ID del producto.");
        return;
    }

    if (botonEliminar) {
        const confirmar = window.confirm(`¿Confirma la baja de ${productName}?`);
        if (!confirmar) {
            return;
        }
        fetch(`/admin/productos/eliminar/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.mensaje || `No se pudo eliminar el producto ${productName}`);
            }
            alert(data.mensaje || `Producto "${productName}" dado de baja`);
            window.location.reload();
        }).catch((error) => {
            alert(error.message || `Error al eliminar el producto ${productName}`);
        });
        return;
    } else if (botonEditar) {
        window.location.href = `/admin/productos/editar/${id}`;
        return;
    }

    fetch(`/admin/productos/reactivar/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.mensaje || "No se pudo reactivar el producto");
        }

        alert(data.mensaje || "Producto reactivado");
        window.location.reload();
    }).catch((error) => {
        alert(error.message || "Error al reactivar el producto");
    });
});