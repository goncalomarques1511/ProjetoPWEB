const mongoose = require('mongoose');

const UtilizadorSchema = new mongoose.Schema({
  nome: String,
  email: String,
  password: String,
  role: String
});

module.exports = mongoose.model('Utilizador', UtilizadorSchema);