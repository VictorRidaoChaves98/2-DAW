// Precarga de usuarios iniciados
let users = [
  { id: 1, name: "Victor", email: "victor@example.com" },
  { id: 2, name: "Manzano", email: "manzano@example.com" }
];

module.exports = {
  getAll: () => users,
  getById: (id) => users.find(u => u.id === id),
  create: (user) => {
    const newUser = { id: Date.now(), ...user };
    users.push(newUser);
    return newUser;
  },
  update: (id, data) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = { ...users[index], ...data };
    return users[index];
  },
  overwrite: (id, data) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    const newUser = { id, ...data };
    users[index] = newUser;
    return newUser;
  },
  delete: (id) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;

    users.splice(index, 1);
    return true;
  }
};
