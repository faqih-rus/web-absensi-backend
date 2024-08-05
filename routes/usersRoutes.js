const express = require("express");
const router = express.Router();
const UsersModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Endpoint utama
router.get("/", async (req, res) => {
  try {
    const users = await UsersModel.findAll();
    res.status(200).json({
      data: users,
      metadata: "Users Endpoint",
    });
  } catch (e) {
    console.error("Error fetching users:", e);
    res.status(500).json({
      error: e.message,
    });
  }
});

// ADD DATA
router.post("/", async (req, res) => {
  try {
    const { nip, nama, password, role } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const existingUser = await UsersModel.findOne({ where: { nip } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const users = await UsersModel.create({
      nip,
      nama,
      password: encryptedPassword,
      role,
    });
    res.status(200).json({
      registered: users,
      metadata: "Add data berhasil",
    });
  } catch (e) {
    console.error("Error adding user:", e);
    res.status(400).json({
      error: "Data invalid",
    });
  }
});

// UPDATE DATA
router.put("/", async (req, res) => {
  const { nip, nama, password, passwordBaru } = req.body;

  try {
    const user = await UsersModel.findOne({ where: { nip } });
    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid password",
      });
    }

    const encryptedPassword = await bcrypt.hash(passwordBaru, 10);
    const [updated] = await UsersModel.update(
      {
        nama,
        password: encryptedPassword,
      },
      { where: { nip: nip } }
    );
    res.status(200).json({
      users: { updated },
      metadata: "User data updated",
    });
  } catch (e) {
    console.error("Error updating user:", e);
    res.status(400).json({
      error: "Data invalid",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { nip, password } = req.body;
    const user = await UsersModel.findOne({ where: { nip } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    
    const token = jwt.sign(
      { nip: user.nip, nama: user.nama, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({
      user: {
        nip: user.nip,
        nama: user.nama,
        role: user.role,
      },
      token,
      metadata: "Login successful",
    });
  } catch (e) {
    console.error("Error during login:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
