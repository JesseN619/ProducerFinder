const geniusToken = process.env.REACT_APP_GENIUS_ACCESS_TOKEN;
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

export const getProducerId = async (songId: string) => {
  const request = await fetch(
    `https://api.genius.com/songs/${songId}?access_token=${geniusToken}`,
    {
      method: "GET",
    }
  );

  const response = await request.json();
  // TODO: instead of producer_artists[0], show dropdown of all producers and let user choose
  return response.response.song.producer_artists[0];
};

export const getProducerImgFromGenius = async (producerId: string) => {
  const request = await fetch(
    `https://api.genius.com/artists/${producerId}?access_token=${geniusToken}`,
    {
      method: "GET",
    }
  );

  const response = await request.json();
  return response.response.artist.image_url;
};

export const getGeniusTopSongs = async (producerId: string) => {
  const request = await fetch(
    `https://api.genius.com/artists/${producerId}/songs?sort=popularity&access_token=${geniusToken}`,
    {
      method: "GET",
    }
  );

  const response = await request.json();
  const topSongs = response.response.songs;
  return topSongs;
};

export const getSpotifyToken = async () => {
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
    },
    body: "grant_type=client_credentials",
  });
  const data = await result.json();
  return data.access_token;
};

export const searchSpotify = async (songTitle: string, headers: Headers) => {
  const request = await fetch(
    `https://api.spotify.com/v1/search?q=${songTitle}&type=track&market=US&limit=5`,
    {
      method: "GET",
      headers: headers,
    }
  );
  const response = await request.json();
  return response.tracks.items;
};

export const getSpotifyTrackById = async (songId: string, headers: Headers) => {
  const request = await fetch(
    `https://api.spotify.com/v1/tracks/${songId}?market=US`,
    {
      method: "GET",
      headers: headers,
    }
  );
  const trackInfo = await request.json();
  return trackInfo;
};
