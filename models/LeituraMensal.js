const mongoose = require('mongoose');

const leituraSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilizador', required: true },
  data: { type: Date, default: Date.now },
  kwh: { type: Number, required: true }
});

module.exports = mongoose.model('LeituraMensal', leituraSchema);