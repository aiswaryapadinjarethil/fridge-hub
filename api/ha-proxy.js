export default async function handler(req, res) {
  // Allow requests from the app origin
  res.setHeader('Access-Control-Allow-Origin', 'https://fridge-hub-phi.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-HA-URL');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // HA base URL is passed in a custom header so token stays client-side
  const haBase = (req.headers['x-ha-url'] || '').replace(/\/$/, '');
  if (!haBase || !/^https?:\/\//i.test(haBase)) {
    return res.status(400).json({ error: 'Missing or invalid X-HA-URL header' });
  }

  // Path to proxy is passed as query param ?path=/api/states/light.bedroom
  const haPath = req.query.path || '/api/';
  const targetUrl = haBase + haPath;

  const token = (req.headers['authorization'] || '').replace(/^Bearer\s+/i, '');
  if (!token) {
    return res.status(400).json({ error: 'Missing Authorization header' });
  }

  try {
    const fetchOpts = {
      method: req.method,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    };
    if (req.method === 'POST' && req.body) {
      fetchOpts.body = JSON.stringify(req.body);
    }

    const haRes = await fetch(targetUrl, fetchOpts);
    const text = await haRes.text();

    res.status(haRes.status);
    try {
      res.json(JSON.parse(text));
    } catch {
      res.send(text);
    }
  } catch (e) {
    res.status(502).json({ error: 'Could not reach Home Assistant', detail: e.message });
  }
}
