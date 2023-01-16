import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn, setAddSongId } from "..";

interface SongListItemProps {
  song: any;
  spotifyHeaders: {
    "Content-Type": string;
    Accept: string;
    Authorization: string;
  };
}

let playSong: HTMLAudioElement;
const stopSong = () => {
  playSong.pause();
  playSong.currentTime = 0;
};

const playPreview = (preview: string) => {
  if (playSong) {
    stopSong();
  }
  playSong = new Audio(preview);
  return playSong.play();
};

export default function SongListItem(props: SongListItemProps) {
  const { song, spotifyHeaders } = props;
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const storeSongId = (songId: string) => {
    dispatch(setAddSongId(songId));
  };

  const [spotifySongId, setSpotifySongId] = useState<string | null>(null);
  const [trackInfo, setTrackInfo] = useState<any | null>(null);

  const artistName = song.primary_artist.name;

  useEffect(() => {
    const searchSpotify = async () => {
      await axios
        .get(
          `https://api.spotify.com/v1/search?q=${song.title}&type=track&market=US&limit=5`,
          { headers: spotifyHeaders }
        )
        .then((response) => {
          const searchResults = response.data.tracks.items;
          const matchingResult = searchResults.find(
            (result: any) =>
              result.artists[0].name.toLowerCase() === artistName.toLowerCase()
          );

          if (matchingResult) {
            setSpotifySongId(matchingResult.id);
            // Get song by songId to get preview URLs (search does not have preview URLs for most songs)
            const getSpotifyTrackById = async () => {
              await axios
                .get(
                  `https://api.spotify.com/v1/tracks/${matchingResult.id}?market=US`,
                  { headers: spotifyHeaders }
                )
                .then((response) => {
                  setTrackInfo(response.data);
                  setSpotifySongId(response.data.id);
                });
            };
            getSpotifyTrackById();
          }
        });
    };

    searchSpotify();
  }, [artistName, song.title, spotifyHeaders]);

  if (!trackInfo || !spotifySongId) return null;

  const displayArtist = trackInfo.artists[0].name;
  const displayTitle = trackInfo.name;
  const displayAlbum = trackInfo.album.name;
  const albumCover = trackInfo.album.images[2].url;

  return (
    <li className="song-list list-none flex whitespace-nowrap items-center my-2 px-2 py-1 bg-white shadow-md rounded">
      <img className="album-cover my-auto" src={albumCover} alt="album cover" />
      <div className="my-auto text-sm overflow-hidden mr-5">
        <p className="font-semibold p-0 m-0 opacity-80">{displayTitle}</p>
        <p className="text-xs p-0 m-0 opacity-60">{displayArtist}</p>
        <p className="text-xs p-0 m-0 opacity-60">{displayAlbum}</p>
      </div>
      <div className="flex ml-auto">
        <div className="flex items-center flex-end mr-1">
          {trackInfo.preview_url && (
            <>
              <button
                className="text-xl"
                onClick={() => playPreview(trackInfo.preview_url)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 mt-auto text-gray-500 hover:text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button className="mr-1 text-xl" onClick={() => stopSong()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-gray-500 hover:text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
        {isLoggedIn && (
          <div className="flex items-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 px-2 rounded text-xl text-gray-200 font-semibold"
              onClick={() => storeSongId(spotifySongId)}
            >
              +
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
