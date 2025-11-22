// load-test.js
const autocannon = require('autocannon');

const instance = autocannon({
  url: 'http://localhost:3000/io-wait',
  connections: 100, // Simula 100 usuários simultâneos
  pipelining: 1,    // 1 requisição por conexão
  duration: 30,     // Duração de 30 segundos
  title: 'Teste de Carga - IO Endpoint'
}, finishedBench);

autocannon.track(instance, { renderProgressBar: true });

function finishedBench(err, res) {
  console.log('Teste concluído!');
  console.log(`Média de Latência: ${res.latency.mean}ms`);
  console.log(`Throughput: ${res.requests.average} req/s`);
  console.log(`Total de Erros: ${res.errors}`);
}