const axios = require('axios');

async function obterProducaoCliente(clienteId) {
  try {
    const response = await axios.get(`http://localhost:3000/api/production/${clienteId}`);
    return response.data.producao_kwh;
  } catch (error) {
    console.error(`Erro na API de produção para cliente ${clienteId}:, error.message`);
    return null;
  }
}

module.exports = { obterProducaoCliente };