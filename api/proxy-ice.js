export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Respuesta rápida a preflight
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { stream_id, session_id, candidate, sdpMid, sdpMLineIndex } = req.body;

  const response = await fetch(`https://api.d-id.com/talks/streams/${stream_id}/ice`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + process.env.DID_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      candidate,
      sdpMid,
      sdpMLineIndex,
      session_id
    })
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
