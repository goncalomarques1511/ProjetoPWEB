// importar mongoose e bcrypt
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// conectar ao banco MongoDB
mongoose.connect('mongodb://localhost:27017/seuprojeto', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const utilizadorSchema = new mongoose.Schema({
  nome: String,
  email: String,
  password: String,
  role: String
});

const Utilizador = mongoose.model('Utilizador', utilizadorSchema);

// função para criar utilizador
async function criarUtilizador(nome, email, senha, role = 'Cliente') {
  const hashedPassword = await bcrypt.hash(senha, 10);

  const novoUtilizador = new Utilizador({
    nome,
    email,
    password: hashedPassword,
    role
  });

  await novoUtilizador.save();
  console.log(` Utilizador (${role}) criado: ${email}`);
  mongoose.disconnect();
}

const [,, nome, email, senha, role] = process.argv;
if (nome && email && senha) {
  criarUtilizador(nome, email, senha, role);
} else {
  console.log(' Utilização: node criarUtilizador.js "Nome" email@mail.com senha123 [Role]');
  mongoose.disconnect();
}