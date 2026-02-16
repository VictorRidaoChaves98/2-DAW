const db = require("../data/users.data");

module.exports = {
  listUsers: () => db.getAll(),

  findUser: (id) => {
    const user = db.getById(id);
    if (!user) throw { status: 404, message: "Usuario no encontrado" };
    return user;
  },

  createUser: (data) => {
    if (!data.name || !data.email)
      throw { status: 400, message: "Faltan campos obligatorios" };

    return db.create(data);
  },

  updateUser: (id, data) => {
    const updated = db.update(id, data);
    if (!updated) throw { status: 404, message: "Usuario no encontrado" };
    return updated;
  },

  overwriteUser: (id, data) => {
    if (!data.name || !data.email)
      throw { status: 400, message: "Faltan campos obligatorios" };

    const updated = db.overwrite(id, data);
    if (!updated) throw { status: 404, message: "Usuario no encontrado" };
    return updated;
  },

  deleteUser: (id) => {
    const deleted = db.delete(id);
    if (!deleted) throw { status: 404, message: "Usuario no encontrado" };
    return deleted;
  }
};
