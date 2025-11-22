const express = require('express');
const app = express();

// Simula processamento pesado (CPU Bound)
function fibonacci(n) {
  if (n < 2) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Serviço operante' });
});

// Endpoint que consome CPU
app.get('/heavy', (req, res) => {
  const start = Date.now();
  const result = fibonacci(35); // Número alto para gerar delay
  const time = Date.now() - start;
  res.json({ status: 'done', result, time });
});

// Endpoint que simula delay de I/O (Banco de dados externo)
app.get('/io-wait', (req, res) => {
  setTimeout(() => {
    res.json({ status: 'done', type: 'io-bound' });
  }, 500); // 500ms de delay
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));