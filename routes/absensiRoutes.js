const express = require("express");
const router = express.Router();
const AbsensiModel = require("../models/absensiModel.js");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const absensi = await AbsensiModel.findAll();
    res.status(200).json({
      absensi,
      metadata: "Endpoint Absensi",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Check-in
router.post("/checkin", authenticateToken, async (req, res) => {
  try {
    const { nip } = req.body;
    const absensi = await AbsensiModel.create({
      users_nip: nip,
      status: "in",
    });
    res.status(200).json({
      data: absensi,
      metadata: "Check-in berhasil",
    });
  } catch (error) {
    res.status(400).json({ error: "Data invalid" });
  }
});

// Check-out
router.post("/checkout", authenticateToken, async (req, res) => {
  try {
    const { nip } = req.body;
    const absensi = await AbsensiModel.create({
      users_nip: nip,
      status: "out",
    });
    res.status(200).json({
      data: absensi,
      metadata: "Check-out berhasil",
    });
  } catch (error) {
    res.status(400).json({ error: "Data invalid" });
  }
});

module.exports = router;