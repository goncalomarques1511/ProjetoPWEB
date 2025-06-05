const express = require('express');
const { verificarRole } = require('../middleware/auth');
const Instalacao = require('../models/Instalacao');
const path = require('path');

const router = express.Router();

// Cliente regista instalação
router.post('/', verificarRole('Cliente'), async (req, res) => {
  try {
    const novaInstalacao = new Instalacao({
      clienteId: req.user.id,
      ...req.body,
      dataInstalacao: new Date()
    });

    await novaInstalacao.save();
    res.status(201).json(novaInstalacao);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registar instalação' });
  }
});

// Técnico valida e associa certificado
router.put('/:id/validar', verificarRole('Técnico Certificado'), async (req, res) => {
  try {
    const instalacao = await Instalacao.findById(req.params.id);
    if (!instalacao) return res.status(404).json({ erro: 'Instalação não encontrada' });

    instalacao.validado = true;
    instalacao.certificado = req.body.certificado || "certificado_teste.pdf"; // ou upload real
    await instalacao.save();

    res.json({ mensagem: 'Instalação validada com sucesso', instalacao });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao validar' });
  }
});

module.exports = router;