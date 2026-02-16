import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header)
    return res.status(401).json({ message: "Falta token" });

  const [type, token] = header.split(" ");

  if (type !== "Bearer")
    return res.status(400).json({ message: "Formato incorrecto" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // añadimos info a la request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export const onlyAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Acceso solo para admin" });

  next();
};
