function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'API Key inválida ou ausente. Inclua o header X-API-Key.',
    });
  }

  next();
}

module.exports = { apiKeyAuth };
