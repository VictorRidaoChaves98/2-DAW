const express = require("express");
const router = express.Router();
const controller = require("../controllers/users.controllers");

router.get("/", controller.getUsers);
router.get("/:id", controller.getUserById);
router.post("/", controller.createUser);
router.patch("/:id", controller.updateUser);
router.put("/:id", controller.overwriteUser);
router.delete("/:id", controller.deleteUser);

module.exports = router;
