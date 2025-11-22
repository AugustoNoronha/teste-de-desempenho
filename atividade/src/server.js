/**
 * SUT - System Under Test
 * API de Checkout Simulada para Aula de Performance
 *
 * NÃO ALTERE ESTE ARQUIVO. O OBJETIVO É TESTAR ESTA APLICAÇÃO COMO UMA CAIXA PRETA.
 */

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs'); // Usado para simular carga de CPU

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

// Rota leve para Smoke Test
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

/**
 * Rota simulando I/O Bound (ex: Banco de Dados, Chamada Externa)
 * Comportamento: Demora um tempo fixo (simulando latência de rede/disco) mas consome pouca CPU.
 * Ideal para Teste de Carga e Spike.
 */
app.post('/checkout/simple', (req, res) => {
    // Simula um delay de I/O de ~100ms a ~300ms
    const delay = Math.floor(Math.random() * 200) + 100;

    setTimeout(() => {
        res.status(201).json({
            id: Math.floor(Math.random() * 10000),
            status: 'APPROVED',
            processingTime: `${delay}ms`
        });
    }, delay);
});

/**
 * Rota simulando CPU Bound (ex: Criptografia, Processamento de Imagem, Relatório Complexo)
 * Comportamento: Bloqueia o Event Loop do Node.js.
 * Ideal para Teste de Estresse (achar o ponto de ruptura).
 */
app.post('/checkout/crypto', (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10); // Custo computacional médio
        const hash = bcrypt.hashSync("senha_super_secreta_do_usuario", salt);

        res.status(201).json({
            id: Math.floor(Math.random() * 10000),
            status: 'SECURE_TRANSACTION',
            hash: hash.substring(0, 20) + '...'
        });
    } catch (e) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 SUT (Ecommerce API) rodando na porta ${PORT}`);
    console.log(`👉 Smoke Test: http://localhost:${PORT}/health`);
    console.log(`👉 Load Test Target: POST http://localhost:${PORT}/checkout/simple`);
    console.log(`👉 Stress Test Target: POST http://localhost:${PORT}/checkout/crypto`);
});