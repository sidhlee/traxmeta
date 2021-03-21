const axios = require('axios').default;

exports.handler = async function (event) {
  if (event.httpMethod !== 'GET') return;

  const {
    spotifyArtistId,
    spotifyTrackId,
    token,
  } = event.queryStringParameters;

  const config = {
    timeout: 1000,
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const heroData = await Promise.allSettled([
    axios({
      url: 'https://api.spotify.com/v1/tracks/' + spotifyTrackId,
      ...config,
    }),
    axios({
      url: 'https://api.spotify.com/v1/artists/' + spotifyArtistId,
      ...config,
    }),
  ]).then((values) => {
    const settledValues = values.map((outcome) => {
      if (outcome.status === 'fulfilled') {
        return outcome.value.data;
      } else {
        return '';
      }
    });

    const [track, artist] = settledValues;

    const heroData = {
      track,
      artist,
    };

    return heroData;
  });

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTION',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode: 200,
    // remove circular reference to be able to converted into JSON
    body: JSON.stringify({ data: heroData }),
  };
};
