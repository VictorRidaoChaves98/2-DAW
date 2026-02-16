const service = require("../services/users.services");

exports.getUsers = (req, res, next) => {
  try {
    res.json(service.listUsers());
  } catch (err) {
    next(err);
  }
};

exports.getUserById = (req, res, next) => {
  try {
    res.json(service.findUser(Number(req.params.id)));
  } catch (err) {
    next(err);
  }
};

exports.createUser = (req, res, next) => {
  try {
    const user = service.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = (req, res, next) => {
  try {
    res.json(service.updateUser(Number(req.params.id), req.body));
  } catch (err) {
    next(err);
  }
};

exports.overwriteUser = (req, res, next) => {
  try {
    res.json(service.overwriteUser(Number(req.params.id), req.body));
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = (req, res, next) => {
  try {
    service.deleteUser(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
