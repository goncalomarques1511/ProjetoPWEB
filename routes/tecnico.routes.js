const express = require('express');
const router = express.Router();
const multer = require('multer');

const { verificarRole } = require('../middleware/auth');

const {
  pesquisarUtilizadores,
  uploadCertificado
} = require('../controllers/tecnicoController');

console.log('pesquisarUtilizadores:', typeof pesquisarUtilizadores);
console.log(' uploadCertificado:', typeof uploadCertificado);

const upload = multer({ dest: 'uploads/' });

router.get('/utilizadores',
  verificarRole('Técnico'),
  pesquisarUtilizadores
);

router.post('/certificados/:id',
  verificarRole('Técnico'),
  upload.single('certificado'),
  uploadCertificado
);

module.exports = router;