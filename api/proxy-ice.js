export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
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

  const body = await req.json();

  const { stream_id, candidate, sdpMid, sdpMLineIndex, session_id } = body;

  if (!stream_id || !candidate || !sdpMid || sdpMLineIndex == null || !session_id) {
    return new Response(JSON.stringify({ message: 'Missing required fields: stream_id, candidate, sdpMid, sdpMLineIndex, session_id' }), {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }

  const apiRes = await fetch(`https://api.d-id.com/talks/streams/${stream_id}/ice`, {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      candidate,
      sdpMid,
      sdpMLineIndex,
      session_id
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
}
