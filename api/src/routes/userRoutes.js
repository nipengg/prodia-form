const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tambah user
router.post('/add', async (req, res) => {
  try {
    const userBaru = await User.create({ 
      name: req.body.name 
    });
    
    res.send({ message: `Berhasil simpan SQL: ${userBaru.nama}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;