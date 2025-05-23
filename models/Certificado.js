const mongoose = require('mongoose');

const CertificadoSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  certificadoPath: String,
  enviadoPor: mongoose.Schema.Types.ObjectId,
  dataEnvio: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificado', CertificadoSchema);