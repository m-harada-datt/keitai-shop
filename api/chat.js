export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { question } = req.body || {};
  if (!question || typeof question !== 'string') {
    res.status(400).json({ error: 'question is required' });
    return;
  }

  try {
    const stormRes = await fetch('https://live-stargate.jpsionic.im/api/v2/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'storm-api-key': process.env.STORM_API_KEY
      },
      body: JSON.stringify({ question })
    });

    const data = await stormRes.json();

    if (!stormRes.ok) {
      res.status(stormRes.status).json({ error: 'STORM API error', detail: data });
      return;
    }

    const answer =
      data.data?.chat?.answer ??
      data.answer ??
      data.data?.answer ??
      data.message ??
      JSON.stringify(data);

    res.status(200).json({ answer });
  } catch (err) {
    res.status(500).json({ error: 'Internal error', detail: String(err) });
  }
}
