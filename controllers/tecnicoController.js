const Utilizador = require('../models/Utilizador');
const Certificado = require('../models/Certificado');

const pesquisarUtilizadores = async (req, res) => {
  const { id, nome } = req.query;
  const query = {};

  if (id) query._id = id;
  if (nome) query.nome = { $regex: nome, $options: 'i' };

  const users = await Utilizador.find(query);
  res.json(users);
};

const uploadCertificado = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }

    const path = req.file.path;

    await Certificado.create({
      userId,
      certificadoPath: path,
      enviadoPor: req.user._id
    });

    res.json({ message: 'Certificado enviado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao processar upload' });
  }
};

module.exports = { pesquisarUtilizadores, uploadCertificado };
