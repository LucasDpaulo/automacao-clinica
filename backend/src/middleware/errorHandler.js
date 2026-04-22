function errorHandler(err, req, res, next) {
  console.error(`[ERRO] ${req.method} ${req.path}:`, err.message);

  const status = err.status || 500;
  res.status(status).json({
    sucesso: false,
    mensagem: err.message || 'Erro interno do servidor.',
  });
}

module.exports = errorHandler;
