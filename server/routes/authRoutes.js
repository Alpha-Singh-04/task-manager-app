const express = require("express");
const router = express.Router();
const { register, login, getUser } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/all",authMiddleware, getUser); //Fetch all users

module.exports = router;
