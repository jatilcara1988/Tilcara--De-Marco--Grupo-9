const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/auth/login?session=error");
    }
    try {
        const payload = jwt.verify(
            token, 
            process.env.JWT_SECRET
        );
        req.usuario = payload;
        next();
    } catch (error){
        res.clearCookie("token");
        return res.redirect("/auth/login?session=error");
    }
};

module.exports = verifyJWT;