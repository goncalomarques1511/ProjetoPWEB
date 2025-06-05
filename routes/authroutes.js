const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Utilizador = require('../models/Utilizador');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'chave_secreta';

// Login geral com JWT
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await Utilizador.findOne({ email });

    if (!user) return res.status(404).json({ erro: 'Utilizador não encontrado' });

    if (role && user.role !== role) {
      return res.status(403).json({ erro: 'Perfil não autorizado para este tipo de acesso' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ erro: 'Senha incorreta' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao autenticar utilizador' });
  }
});

module.exports = router;