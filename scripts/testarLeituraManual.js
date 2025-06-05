require('dotenv').config();
const mongoose = require('mongoose');
const LeituraMensal = require('../models/LeituraMensal');
const Utilizador = require('../models/Utilizador');
const { obterProducaoCliente } = require('../services/energiaService');
const { enviarEmail } = require('../services/emailService');

async function executarLeituraManual() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(' Conectado à base de dados');

  const clientes = await Utilizador.find({ role: 'Cliente' });

  for (const cliente of clientes) {
    const novaLeitura = await obterProducaoCliente(cliente._id);
    if (novaLeitura == null) continue;

    const ultima = await LeituraMensal.findOne({ clienteId: cliente._id }).sort({ data: -1 });
    const diferenca = ultima ? novaLeitura - ultima.kwh : novaLeitura;

    await LeituraMensal.create({ clienteId: cliente._id, kwh: novaLeitura });
    await enviarEmail(cliente.email, diferenca);
  }

  console.log(' Leitura e envio de email manual concluídos');
  mongoose.disconnect();
}

executarLeituraManual();