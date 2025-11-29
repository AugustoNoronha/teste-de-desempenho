import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 200 },
    { duration: '2m', target: 500 },
    { duration: '2m', target: 1000 },
  ],
};

export default function () {
  const payload = JSON.stringify({ securityLevel: 'high' });
  const headers = { 'Content-Type': 'application/json' };

  const res = http.post('http://localhost:3000/checkout/crypto', payload, { headers });
  check(res, { 'status 200 OK': (r) => r.status === 200 });
}
