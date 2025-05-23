const jwt = require('jsonwebtoken');

const autenticarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'Token ausente' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });

    req.user = user;
    next();
  });
};

const verificarRoleTecnico = (req, res, next) => {
  if (req.user.role !== 'Técnico') {
    return res.status(403).json({ message: 'Acesso negado: não é Técnico' });
  }
  next();
};

module.exports = { autenticarToken, verificarRoleTecnico };
