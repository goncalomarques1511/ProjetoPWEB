const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Utilizador = require('../models/Utilizador');

// Criar novo utilizador
router.post('/', async (req, res) => {
  try {
    const { nome, email, password, role } = req.body;

    const userExists = await Utilizador.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email já registrado' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new Utilizador({ nome, email, password: hashed, role });

    await newUser.save();
    res.status(201).json({ message: 'Utilizador criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar utilizador' });
  }
});

// Excluir utilizador por email
router.delete('/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const result = await Utilizador.deleteOne({ email });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }
    res.json({ message: 'Utilizador excluído com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao excluir utilizador' });
  }
});

module.exports = router;
