require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor DentalCare rodando em http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
