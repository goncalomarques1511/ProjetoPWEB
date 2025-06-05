require('dotenv').config();
require('./jobs/leituraMensal');

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Conectar ao MongoDB
connectDB();

// Middleware global
app.use(cors());
app.use(express.json());

// Rotas principais
app.use('/api/auth', require('./routes/authroutes'));
app.use('/api/tecnico', require('./routes/tecnico.routes'));
app.use('/api/utilizadores', require('./routes/utilizadorRoutes'));
app.use('/api/instalacoes', require('./routes/instalacaoRoutes'));
app.use('/api/production', require('./routes/productionRoutes'));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(' pesquisarUtilizadores:', typeof require('./controllers/tecnicoController').pesquisarUtilizadores);
  console.log('uploadCertificado:', typeof require('./controllers/tecnicoController').uploadCertificado);
  console.log( `Servidor iniciado na porta ${PORT}`);
});