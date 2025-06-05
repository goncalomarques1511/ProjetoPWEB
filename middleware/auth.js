const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'chave_secreta';

// Middleware genérico para verificar token JWT
function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ erro: 'Token inválido' });
  }
}

// Middleware específico: verificar se utilizador tem papel esperado
function verificarRole(roleEsperado) {
  return (req, res, next) => {
    verificarToken(req, res, () => {
      if (req.user?.role !== roleEsperado) {
        return res.status(403).json({ erro: 'Permissão negada' });
      }
      next();
    });
  };
}

// Versão específica para técnicos (caso queiras usar diretamente)
function verificarRoleTecnico(req, res, next) {
  verificarToken(req, res, () => {
    if (req.user.role !== 'Técnico') {
      return res.status(403).json({ erro: 'Acesso negado: não é Técnico' });
    }
    next();
  });
}

module.exports = {
  verificarToken,
  verificarRole,
  verificarRoleTecnico
};