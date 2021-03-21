const axios = require('axios').default;

exports.handler = async function (event) {
  if (event.httpMethod !== 'GET') return;
  const { artistName, trackName } = event.queryStringParameters;

  const config = {
    timeout: 1000,
    method: 'get',
  };

  const query = `?apikey=${
    process.env.API_MUSIXMATCH
  }&q_artist=${encodeURIComponent(artistName)}&q_track=${encodeURIComponent(
    trackName
  )}`;

  const response = await axios({
    url: `http://api.musixmatch.com/ws/1.1/matcher.lyrics.get` + query,
    ...config,
  });

  const {
    message: {
      header: { status_code },
      body: {
        lyrics: { lyrics_body },
      },
    },
  } = response.data;

  const lyrics = lyrics_body.split(
    '******* This Lyrics is NOT for Commercial use *******'
  )[0];

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTION',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode: status_code,
    body: JSON.stringify({ data: lyrics }),
  };
};
