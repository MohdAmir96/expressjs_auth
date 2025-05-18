const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  me,
} = require("../controllers/auth.controller");

router.get("/me", me);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
