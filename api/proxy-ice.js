export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Only POST allowed' }), {
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }

  const apiKey = 'Basic cmV0YXpvc3lmcmFtZXNAZ21haWwuY29t:0hQSimebYtbycSBFcLHsf';
  const rawBody = await req.text(); // <-- Esto es clave

  const parsedBody = JSON.parse(rawBody);
  const { stream_id, ...icePayload } = parsedBody;

  if (!stream_id) {
    return new Response(JSON.stringify({ message: 'Missing stream_id' }), {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  const apiRes = await fetch(`https://api.d-id.com/talks/streams/${stream_id}/ice`, {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(icePayload),
  });

  const data = await apiRes.text();

  return new Response(data, {
    status: apiRes.status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  });
}
