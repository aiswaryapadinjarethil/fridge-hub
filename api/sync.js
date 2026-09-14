// Kitchen Hub sync API - Upstash Redis REST API
const SYNC_KEY = 'kitchenhub_data';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return res.status(500).json({ error: 'Upstash not configured - check Vercel environment variables' });
  }

  try {
    if (req.method === 'GET') {
      const r = await fetch(`${url}/get/${SYNC_KEY}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await r.json();
      if (!json.result) return res.status(200).json({ data: null });
      return res.status(200).json({ data: JSON.parse(decodeURIComponent(json.result)) });
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      if (!body || !body.data) return res.status(400).json({ error: 'No data' });

      const payload = encodeURIComponent(JSON.stringify({
        ...body.data,
        syncedAt: new Date().toISOString()
      }));

      const r = await fetch(`${url}/set/${SYNC_KEY}/${payload}`, {
        method: 'GET', // Upstash REST uses GET for SET commands via URL
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await r.json();
      if (json.result !== 'OK') throw new Error('Redis SET failed: ' + JSON.stringify(json));
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
