const cron = require('node-cron');
const LeituraMensal = require('../models/LeituraMensal');
const Utilizador = require('../models/Utilizador');
const { obterProducaoCliente } = require('../services/energiaService');
const { enviarEmail } = require('../services/emailService');

// Agendamento mensal: dia 1 de cada mês às 00:00
cron.schedule('0 0 1 * *', async () => {
  console.log(' Executando leitura mensal de energia...');

  try {
    const clientes = await Utilizador.find({ role: 'Cliente' });

    for (const cliente of clientes) {
      const novaLeitura = await obterProducaoCliente(cliente._id);
      if (novaLeitura == null) continue;

      const ultima = await LeituraMensal.findOne({ clienteId: cliente._id }).sort({ data: -1 });
      const diferenca = ultima ? novaLeitura - ultima.kwh : novaLeitura;

      await LeituraMensal.create({
        clienteId: cliente._id,
        kwh: novaLeitura
      });

      await enviarEmail(cliente.email, diferenca);
    }

    console.log(' Leitura mensal concluída');
  } catch (err) {
    console.error('Erro no agendamento mensal:', err);
  }
});

