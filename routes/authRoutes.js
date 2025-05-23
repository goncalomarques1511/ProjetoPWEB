const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Utilizador = require('../models/Utilizador');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await Utilizador.findOne({ email });

  if (!user || user.role !== 'Técnico') {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas' });

  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
