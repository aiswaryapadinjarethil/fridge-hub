// Kitchen Hub sync API - reads/writes to Upstash Redis
// Environment variables are auto-set by Vercel from the Upstash integration

const SYNC_KEY = 'kitchenhub_data';

async function redisCommand(command) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('Upstash not configured');
  const res = await fetch(`${url}/${command.join('/')}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Redis error: ' + res.status);
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const result = await redisCommand(['GET', SYNC_KEY]);
      if (!result.result) return res.status(200).json({ data: null });
      return res.status(200).json({ data: JSON.parse(result.result) });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body || !body.data) return res.status(400).json({ error: 'No data provided' });
      const payload = JSON.stringify({ ...body.data, syncedAt: new Date().toISOString() });
      await redisCommand(['SET', SYNC_KEY, encodeURIComponent(payload)]);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
