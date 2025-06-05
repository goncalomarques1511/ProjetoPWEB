const mongoose = require('mongoose');

const instalacaoSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilizador',
    required: true
  },
  localizacao: String,
  potencia: Number,
  dataInstalacao: Date,
  validado: {
    type: Boolean,
    default: false
  },
  certificado: String
});

module.exports = mongoose.model('Instalacao', instalacaoSchema);