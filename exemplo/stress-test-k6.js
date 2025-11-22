// k6 run stress-test-k6.js

import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuração do Cenário de Estresse
export const options = {
  // A carga sobe gradualmente para encontrar o ponto de ruptura
  stages: [
    { duration: '1m', target: 50 },  // Sobem 50 usuários (Aquecimento)
    { duration: '2m', target: 200 }, // Sobem para 200 (Carga Alta)
    { duration: '2m', target: 500 }, // Sobem para 500 (Estresse Extremo)
    { duration: '1m', target: 0 },   // Esfriamento (Recovery)
  ],
  // Critérios de Aceitação (SLA)
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% das reqs devem ser < 2s
    http_req_failed: ['rate<0.05'],    // Erros abaixo de 5%
  },
};

export default function () {
  // Simulando um usuário acessando o endpoint pesado
  const res = http.get('http://localhost:3000/heavy');

  // Validações funcionais
  check(res, {
    'status é 200': (r) => r.status === 200,
    'tempo aceitável': (r) => r.timings.duration < 2000
  });

  sleep(1); // Pacing: usuário pensa 1s antes de tentar de novo
}