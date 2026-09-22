export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.TYPESAFE_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'TYPESAFE_API_KEY is not configured' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const state = body.state || {};

    const payload = {
      model: process.env.TYPESAFE_MODEL || 'jev-latest',
      state: JSON.stringify({
        product: 'CricketVision AI',
        task: 'classify cricket video evidence and decide whether human review is needed',
        evidence: state
      }),
      questions: {
        delivery_type: {
          type: 'choice',
          instructions: 'Given only the supplied video metadata/evidence, choose the most defensible delivery category. If evidence is insufficient, choose uncertain.',
          options: ['yorker', 'full', 'good_length', 'short', 'bouncer', 'slower_ball', 'uncertain']
        },
        video_quality: {
          type: 'choice',
          instructions: 'Classify whether the supplied video metadata indicates useful, borderline, or poor analysis quality.',
          options: ['good', 'borderline', 'poor']
        },
        needs_review: {
          type: 'noul',
          instructions: 'Should this evidence be escalated for human review before CricketVision presents a confident cricket insight?'
        }
      }
    };

    const upstream = await fetch('https://api.typesafe.ai/v1/systemone', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const text = await upstream.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    return res.status(upstream.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Jev request failed', detail: error.message });
  }
}
