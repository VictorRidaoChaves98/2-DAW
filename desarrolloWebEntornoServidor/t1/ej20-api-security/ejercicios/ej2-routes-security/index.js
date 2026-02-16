import express from "express";
const app = express();

const checkRole = (requiredRole) => {
    return (req, res, next) => {
        const role = req.headers["x-role"];

        if (!role) {
            return res.status(401).json({ error: "Rol no proporcionado" });
        }

        if (requiredRole === "public") return next();

        if (requiredRole === "vip" && (role === "user" || role === "admin")) {
            return next();
        }

        if (requiredRole === "admin" && role === "admin") {
            return next();
        }

        return res.status(403).json({ error: "Acceso denegado" });
    };
};

app.get("/public", checkRole("public"), (req, res) => {
    res.json({ msg: "Acceso público permitido" });
});

app.get("/vip", checkRole("vip"), (req, res) => {
    res.json({ msg: "Bienvenido, usuario VIP" });
});

app.get("/admin", checkRole("admin"), (req, res) => {
    res.json({ msg: "Bienvenido, admin" });
});

app.listen(3000, () => console.log("Servidor iniciado en puerto 3000"));
