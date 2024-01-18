const { register, login, allUsers } = require("../controllers/auth");

const express = require("express");
const router = express.Router();

router.get("/", allUsers);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
