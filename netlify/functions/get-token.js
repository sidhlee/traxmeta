const axios = require('axios').default;
const qs = require('qs');

exports.handler = async function (event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };
  const authString = Buffer.from(
    `${process.env.API_SPOTIFY}:${process.env.SECRET_SPOTIFY}`
  ).toString('base64');

  try {
    const { data } = await axios({
      method: 'POST',
      url: process.env.URL_TOKEN_SPOTIFY,
      // Spotify API accepts parameters encoded in application/x-www-form-urlencoded
      // so we need to turn obj into key=value with qs.stringify
      data: qs.stringify({
        grant_type: 'client_credentials',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authString}`,
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ data }),
    };
  } catch (err) {
    console.log(err);
  }
};
