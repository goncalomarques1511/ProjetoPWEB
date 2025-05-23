// importar mongoose e bcrypt
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// conectar ao banco MongoDB
mongoose.connect('mongodb://localhost:27017/seuprojeto', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// definir o modelo de utilizador (igual ao do projeto)
const utilizadorSchema = new mongoose.Schema({
  nome: String,
  email: String,
  password: String,
  role: String
});

const Utilizador = mongoose.model('Utilizador', utilizadorSchema);

// criar utilizador técnico com senha hash
async function criarTecnico() {
  const senha = 'senha123';
  const hash = await bcrypt.hash(senha, 10); // encriptar a senha

  await Utilizador.create({
    nome: 'João Técnico',
    email: 'tecnico@example.com',
    password: hash,
    role: 'Técnico'
  });

  console.log('✅ Utilizador Técnico criado com sucesso!');
  mongoose.disconnect();
}

criarTecnico();
