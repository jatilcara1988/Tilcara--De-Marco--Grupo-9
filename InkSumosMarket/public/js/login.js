const btnAccesoRapido = document.getElementById("btnAccesoRapido");
const inputs = document.querySelectorAll("input");
const avisoError = document.querySelector(".alerta");
const params = new URLSearchParams(window.location.search);

if (params.get("session") === "error") {
    alert("Debes iniciar sesión nuevamente.");
    window.history.replaceState(
        {},
        document.title,
        "/auth/login"
    );
}

btnAccesoRapido.addEventListener("click", () => {
    document.getElementById("email").value = "jdPrimero@test.com";
    document.getElementById("password").value = "password123";
});

inputs.forEach(input => {
    input.addEventListener("input", () => {
        if (avisoError) {
            avisoError.style.display = "none";
        }
    });
});