const axios = require('axios').default;

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'GET') return;

  try {
    const { token } = event.queryStringParameters;
    const [{ data: first100 }, { data: second100 }] = await Promise.all([
      axios({
        url: process.env.URL_PLAYLIST_SPOTIFY,
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      axios({
        url: process.env.URL_PLAYLIST_SPOTIFY + '?offset=100&limit=100',
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    const playlist = first100.items.concat(second100.items);

    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTION',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 200,
      body: JSON.stringify({ data: playlist }),
    };
  } catch (err) {
    console.log(err);
  }
};
