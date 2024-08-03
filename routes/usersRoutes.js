const express = require("express");
const router = express.Router();
const UsersModel = require("../models/users");
const bcrypt = require("bcrypt");
// const passwordCheck = require("../utils/passwordCheck");

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
  try {
    const { nip, password } = req.body;
    const check = await passwordCheck(nip, password);
    if (check.compare === true) {
      res.status(200).json({
        users: check.userData,
        metadata: "Login success",
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

module.exports = router;
