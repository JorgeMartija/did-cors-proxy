res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if (req.method === 'OPTIONS') {
  return res.status(200).end();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { stream_id, session_id, ...rest } = req.body;

  const response = await fetch(`https://api.d-id.com/talks/streams/${stream_id}`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + process.env.DID_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...rest,
      session_id
    })
  });

  const data = await response.json();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(response.status).json(data);
}
