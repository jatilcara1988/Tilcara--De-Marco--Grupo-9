function validateRegister(req, res, next){
    const errores = [];
    const nombre = req.body.nombre?.trim() || "";
    const correo = req.body.correo?.trim().toLowerCase() || "";
    const contrasena = req.body.contrasena || "";
    const telefono = req.body.telefono?.trim() || "";
    const rol = req.body.rol?.trim() || "";
    if(!nombre){
        errores.push("Nombre obligatorio");
    }
    if(!correo){
        errores.push("Correo obligatorio");
    }
    if(!contrasena){
        errores.push("Contraseña obligatoria");
    }
    if(!telefono){
        errores.push("Teléfono obligatorio");
    }
    if(!rol){
        errores.push("Rol obligatorio");
    }
    if(errores.length > 0){
        return res.status(400).json({
            errores
        });
    }
    req.usuarioNormalizado = {
        nombre,
        correo,
        contrasena,
        telefono,
        rol
    };
    next();
}

module.exports = validateRegister;