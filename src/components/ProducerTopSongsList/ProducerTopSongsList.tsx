import React, { useEffect, useState } from "react";
import SongListItem from "./SongListItem";

const geniusToken = process.env.REACT_APP_GENIUS_ACCESS_TOKEN;
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

interface ProducerTopSongsListProps {
  producerInfo: any | null;
}

export const ProducerTopSongsList = (props: ProducerTopSongsListProps) => {
  const { producerInfo } = props;
  const [topSongs, setTopSongs] = useState<any[] | null>(null);
  const [spotifyHeaders, setSpotifyHeaders] = useState<{
    "Content-Type": string;
    Accept: string;
    Authorization: string;
  } | null>(null);

  const producerId = producerInfo ? producerInfo.id : null;

  useEffect(() => {
    if (!producerId) return;

    const getGeniusTopSongs = async () => {
      const request = await fetch(
        `https://api.genius.com/artists/${producerId}/songs?sort=popularity&access_token=${geniusToken}`,
        {
          method: "GET",
        }
      );

      const response = await request.json();
      const topSongs = response.response.songs;
      setTopSongs(topSongs);
    };

    getGeniusTopSongs();
  }, [producerId]);

  useEffect(() => {
    if (spotifyHeaders) return;
    const getSpotifyHeaders = async () => {
      const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
        },
        body: "grant_type=client_credentials",
      });
      const data = await result.json();
      const spotifyToken = data.access_token;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${spotifyToken}`,
      };
      setSpotifyHeaders(headers);
    };

    getSpotifyHeaders();
  }, [spotifyHeaders]);

  if (!topSongs || !spotifyHeaders) return <div>Loading...</div>;

  return (
    <div id="list-container" className="flex justify-center rounded">
      <img src="" alt="" />
      <ul id="list" className="text-left">
        {!!topSongs.length &&
          topSongs.map((song) => (
            <SongListItem
              key={song.id}
              song={song}
              spotifyHeaders={spotifyHeaders}
            />
          ))}
      </ul>
    </div>
  );
};
