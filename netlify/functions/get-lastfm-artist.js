const axios = require('axios').default;

exports.handler = async function (event) {
  if (event.httpMethod !== 'GET') return;
  const { artistName } = event.queryStringParameters;

  const config = {
    timeout: 5000,
    method: 'get',
  };

  const response = await axios({
    url: `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
      artistName
    )}&api_key=${process.env.API_LASTFM}&format=json`,
    ...config,
  });

  const artistLastFm = response.data.artist;

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTION',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode: 200,
    // remove circular reference to be able to converted into JSON
    body: JSON.stringify({ data: artistLastFm }),
  };
};
