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

  try {
    const apiKey = 'Basic cmV0YXpvc3lmcmFtZXNAZ21haWwuY29t:0hQSimebYtbycSBFcLHsf';
    const rawBody = await req.text();
    const {
      stream_id,
      session_id,
      script,
      config,
      audio_optimization
    } = JSON.parse(rawBody);

    if (!stream_id || !session_id || !script || !script.input) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }

    const apiRes = await fetch(`https://api.d-id.com/talks/streams/${stream_id}`, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id,
        script,
        config,
        audio_optimization
      }),
    });

    const data = await apiRes.text();

    return new Response(data, {
      status: apiRes.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });

  } catch (err) {
    return new Response(JSON.stringify({ message: 'Server error', error: err.message }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }
}
