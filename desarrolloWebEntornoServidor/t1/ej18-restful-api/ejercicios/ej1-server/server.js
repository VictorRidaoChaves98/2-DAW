import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import { z } from "zod";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

let users = [
    { id: 1, name: "Victor", email: "victor@example.com" },
    { id: 2, name: "Manzano", email: "manzano@example.com" }
];


const UserSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email("Email inválido")
});

app.get("/users", (req, res) => {
    res.json(users);
});

app.get("/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((u) => u.id === id);

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
});

app.post("/users", (req, res) => {
    const parsed = UserSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
    }

    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        ...parsed.data
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

app.put("/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) return res.status(404).json({ error: "Usuario no encontrado" });

    const parsed = UserSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
    }

    users[index] = { id, ...parsed.data };
    res.json(users[index]);
});

app.delete("/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const exists = users.some((u) => u.id === id);

    if (!exists) return res.status(404).json({ error: "Usuario no encontrado" });

    users = users.filter((u) => u.id !== id);
    res.status(204).send();
});

app.set("json spaces", 2);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
