export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Preflight request para CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      },
    });
  }

  // Solo permitir POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ message: 'Only POST allowed' }),
      {
        status: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // Reemplaza con tu stream ID fijo o hazlo dinámico si lo necesitas
  const apiRes = await fetch('https://api.d-id.com/talks/streams/YOUR_STREAM_ID', {
    method: 'POST',
    headers: {
      'Authorization': req.headers.get('Authorization'),
      'Content-Type': 'application/json',
    },
    body: req.body,
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
