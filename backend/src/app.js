const express = require('express');
const cors = require('cors');

const especialidadesRoutes = require('./routes/especialidades');
const horariosRoutes = require('./routes/horarios');
const agendamentosRoutes = require('./routes/agendamentos');
const webhookRoutes = require('./routes/webhook');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5678',
  'http://127.0.0.1:5678',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:8080',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/especialidades', especialidadesRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/agendamentos', agendamentosRoutes);
app.use('/api/webhook', webhookRoutes);

app.use(errorHandler);

module.exports = app;
