document.addEventListener("DOMContentLoaded", () => {
    sessionStorage.clear();
    const btnContinue = document.getElementById("btnContinue");
    const btnLoginAdmin = document.getElementById("btnLoginAdmin");
    const inputName = document.getElementById("txtName");
    const aviso = document.getElementById("noticeMessage");

    btnContinue.addEventListener("click", () => {
        const name = inputName.value.trim();
        const error = validateName(name);
        if (error) {
            aviso.textContent = error;
            aviso.style.color = "rgb(237, 77, 77)";
            return;
        }
        aviso.textContent = "";
        sessionStorage.setItem("cliente", name);
        window.location.href = "products.html";
    })

    btnLoginAdmin.addEventListener("click", () => {
        window.location.href = "/auth/login";
    })
})

const validateName = (data) => {
    //valida que una cadena contenga únicamente letras (incluyendo tildes y ñ) y espacios
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!data || data.trim() === "") {
        return "El nombre no puede estar vacío";
    }
    if (data.length < 3) {
        return "El nombre es muy corto";
    }
    if (data.length > 30) {
        return "El nombre es demasiado largo";
    }
    if (!regex.test(data)) {
        return "El nombre solo puede contener letras";
    }
    return null; 
}
