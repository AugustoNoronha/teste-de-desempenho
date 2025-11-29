import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '2m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const payload = JSON.stringify({ amount: 10, items: 2 });
  const headers = { 'Content-Type': 'application/json' };

  const res = http.post('http://localhost:3000/checkout/simple', payload, { headers });
  check(res, { 'status 200 OK': (r) => r.status === 200 });
}
