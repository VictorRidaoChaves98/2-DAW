import express from "express";

const app = express();
app.use(express.json());

let users = []; // array donde guardaremos los usuarios
let nextId = 1;

// GET all users
app.get("/users", (req, res) => {
    res.json(users);
});

// GET user by id
app.get("/users/:id", (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
});

// POST create user
app.post("/users", (req, res) => {
    const newUser = { id: nextId++, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT update user
app.put("/users/:id", (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: "User not found" });
    Object.assign(user, req.body);
    res.json(user);
});

// DELETE user
app.delete("/users/:id", (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "User not found" });
    users.splice(index, 1);
    res.status(204).send();
});

app.listen(3000, () => console.log("Servidor escuchando en http://localhost:3000"));
