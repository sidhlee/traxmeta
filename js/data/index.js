export async function request(ajaxSettings) {
  const response = await $.ajax(ajaxSettings);
  const { data } = JSON.parse(response);
  return data;
}
export async function getToken() {
  const response = await request({
    url: '/.netlify/functions/get-token',
    method: 'get',
  });
  return response.access_token;
}
export async function getPlayListItems(token) {
  const playlistItems = await request({
    url: '/.netlify/functions/get-playlist',
    method: 'get',
    data: {
      token,
    },
  });
  return playlistItems;
}
export async function getHeroData(token, trackRank) {
  const { track_id, artist_id } = $('.chart-item')[trackRank - 1].dataset;
  const data = {
    token,
    spotifyArtistId: artist_id,
    spotifyTrackId: track_id,
  };
  const { track, artist } = await request({
    url: '/.netlify/functions/get-meta-hero',
    method: 'get',
    data,
  });
  return {
    track,
    artist,
    trackRank,
  };
}
export async function getLyrics(artistName, trackName) {
  const data = {
    artistName,
    trackName,
  };
  try {
    const lyrics = await request({
      url: '/.netlify/functions/get-lyrics',
      method: 'get',
      data,
    });
    return lyrics;
  } catch (err) {
    return ''; // return empty string on Error response
  }
}
export async function getLastFmArtist(artistName) {
  const name = artistName.split(',')[0];
  const data = { artistName: name };
  const lastFmArtist = await request({
    url: '/.netlify/functions/get-lastfm-artist',
    method: 'get',
    data,
  });
  return lastFmArtist;
}
