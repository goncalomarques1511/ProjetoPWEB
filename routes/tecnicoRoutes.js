const express = require('express');
const router = express.Router();
const multer = require('multer');


const { autenticarToken, verificarRoleTecnico } = require('../middleware/auth');


const {
  pesquisarUtilizadores,
  uploadCertificado
} = require('../controllers/tecnicoController');


const upload = multer({ dest: 'uploads/' });


router.get('/utilizadores',
  autenticarToken,
  verificarRoleTecnico,
  pesquisarUtilizadores
);


router.post('/certificados/:id',
  autenticarToken,
  verificarRoleTecnico,
  upload.single('certificado'),  
  uploadCertificado
);

module.exports = router;
