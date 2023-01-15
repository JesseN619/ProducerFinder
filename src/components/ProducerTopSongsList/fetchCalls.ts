const geniusToken = process.env.REACT_APP_GENIUS_ACCESS_TOKEN;

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
