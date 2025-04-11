export default async function handler(req, res) {
  // 🔐 CORS HEADERS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Respuesta rápida a preflight
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { answer, session_id } = req.body;

  const response = await fetch(`https://api.d-id.com/talks/streams/${session_id}/sdp`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + process.env.DID_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      answer,
      session_id
    })
  });

  const data = await response.json();
  res.status(response.status).json(data);
}

