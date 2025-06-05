const express = require('express');
const axios = require('axios');
const { verificarRole } = require('../middleware/auth');
const Utilizador = require('../models/Utilizador');
const LeituraMensal = require('../models/LeituraMensal');
const mongoose = require('mongoose');

const router = express.Router();

// Rota protegida: obter produção energética de um cliente
router.get('/:idClient', verificarRole('Gestor Operações'), async (req, res) => {
  const { idClient } = req.params;

  // 1. Validar o ID
  if (!mongoose.Types.ObjectId.isValid(idClient)) {
    return res.status(400).json({ erro: 'ID de cliente inválido' });
  }

  try {
    // 2. Verificar se cliente existe e é do tipo Cliente
    const cliente = await Utilizador.findById(idClient);
    if (!cliente || cliente.role !== 'Cliente') {
      return res.status(404).json({ erro: 'Cliente não encontrado ou inválido' });
    }

    // 3. Obter produção simulada (fallback incluído)
    let kwh;
    try {
      const resposta = await axios.get('https://random-data-api.com/api/number/random_number');
      kwh = resposta?.data?.digit || Math.floor(Math.random() * 100 + 1);
    } catch {
      kwh = Math.floor(Math.random() * 100 + 1);
    }

    // 4. Armazenar leitura atual
    await LeituraMensal.create({ clienteId: idClient, kwh });

    // 5. Calcular crédito energético
    const credito = (kwh * 0.15).toFixed(2);

    // 6. Obter últimas 5 leituras
    const historico = await LeituraMensal.find({ clienteId: idClient })
      .sort({ data: -1 })
      .limit(5)
      .select('data kwh');

    const historicoFormatado = historico.map(leitura => ({
      data: leitura.data.toISOString().split('T')[0],
      kwh: leitura.kwh
    }));

    // 7. Resposta final
    res.json({
      cliente: {
        id: cliente._id,
        nome: cliente.nome,
        email: cliente.email
      },
      producao_kwh: kwh,
      credito_energia: `${credito}€`,
      historico: historicoFormatado
    });
  } catch (erro) {
    console.error('Erro ao obter produção:', erro);
    res.status(500).json({ erro: 'Erro interno ao obter dados de produção' });
  }
});

module.exports = router;
