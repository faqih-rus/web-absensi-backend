const express = require("express");
const router = express.Router();
const UsersModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const passwordCheck = require("../utils/passwordCheck");

// Endpoint utama
router.get("/", async (req, res) => {
  try {
    const users = await UsersModel.findAll();
    res.status(200).json({
      data: users,
      metadata: "Users Endpoint",
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

// ADD DATA
router.post("/", async (req, res) => {
  try {
    const { nip, nama, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await UsersModel.findOne({ where: { nip } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await UsersModel.create({
      nip,
      nama,
      password: encryptedPassword,
      role,
    });
    res.status(200).json({
      registered: user,
      metadata: "Add data berhasil",
    });
  } catch (error) {
    res.status(400).json({
      error: "Data invalid",
    });
  }
});


// UPDATE DATA
router.put("/", async (req, res) => {
  try {
    const { nip, nama, password, passwordBaru } = req.body;
    const check = await passwordCheck(nip, password);
    const encryptedPassword = await bcrypt.hash(passwordBaru, 10);

    if (check.compare === true) {
      const [updated] = await UsersModel.update(
        { nama, password: encryptedPassword },
        { where: { nip: nip } }
      );
      res.status(200).json({
        users: { updated },
        metadata: "User data updated",
      });
    } else {
      res.status(401).json({
        error: "Unauthorized",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "Data invalid",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  console.log("Login attempt received:", req.body);
  try {
    const { nip, password } = req.body;

    if (!nip || !password) {
      console.log("Missing NIP or password");
      return res.status(400).json({
        error: "NIP and password are required",
      });
    }

    const user = await UsersModel.findOne({ where: { nip } });

    if (!user) {
      console.log("User not found:", nip);
      return res.status(401).json({
        error: "User not found",
      });
    }

    console.log("User found:", user.nip);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Invalid password for user:", nip);
      return res.status(401).json({
        error: "Invalid password",
      });
    }

    console.log("Login successful for user:", nip);
    res.status(200).json({
      users: {
        nip: user.nip,
        nama: user.nama,
        role: user.role,
      },
      metadata: "Login success",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});


router.post("/logout")

module.exports = router;
