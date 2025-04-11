export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const response = await fetch(`https://api.d-id.com/talks/streams/${req.body.session_id}/sdp`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + process.env.DID_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  });

  const data = await response.json();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(response.status).json(data);
}
