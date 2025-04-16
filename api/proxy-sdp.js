export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Manejar la petición OPTIONS para CORS
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

  const apiKey = 'Basic bXVqZXJudWV2YXlvcmtAZ21haWwuY29t:S-4z6mEBXggmFep6ymhBw';
  const bodyText = await req.text();
  const body = JSON.parse(bodyText);

  const { stream_id, answer, session_id } = body;

  if (!stream_id || !answer || !session_id) {
    return new Response(JSON.stringify({ message: 'Missing required fields' }), {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }

  const apiRes = await fetch(`https://api.d-id.com/talks/streams/${stream_id}/sdp`, {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answer, session_id }),
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
