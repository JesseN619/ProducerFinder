import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectIsLoggedIn } from "..";
import { setAddSongId } from "./AddSongIdSlice";
import {
  getGeniusTopSongs,
  getProducerId,
  getProducerImgFromGenius,
  getSpotifyToken,
  searchSpotify,
} from "./fetchCalls";

const geniusToken = process.env.REACT_APP_GENIUS_ACCESS_TOKEN;

let playSong: HTMLAudioElement;
const stopSong = () => {
  playSong.pause();
  playSong.currentTime = 0;
};

const playPreview = (e: MouseEvent, preview: string) => {
  if (playSong) {
    stopSong();
  }
  playSong = new Audio(preview);
  return playSong.play();
};

export const ProducerTopSongsList = () => {
  const dispatch = useDispatch();
  const storeSongId = (songId: string) => {
    dispatch(setAddSongId(songId));
  };
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const search = async () => {
    const getSongId = async () => {
      const searchBox = document.getElementById(
        "song-search"
      ) as HTMLInputElement;
      const searchValue = searchBox.value;

      const request = await fetch(
        `https://api.genius.com/search?q=${searchValue}&access_token=${geniusToken}`,
        {
          method: "GET",
        }
      );
      const response = await request.json();
      const songId = response.response.hits[0].result.id;
      return songId;
    };

    const songId = await getSongId();

    const producerInfo = await getProducerId(songId);
    const producerId = producerInfo.id;
    const producerName = producerInfo.name;

    const producerImgURL = await getProducerImgFromGenius(producerId);

    const topSongs = await getGeniusTopSongs(producerId);

    const listContainer = document.getElementById("list-container")!;
    listContainer.innerHTML = `<ul id="list"></ul>`;
    const ul = document.getElementById("list")!;
    ul.className = "text-left";

    // Spotify =====================================================

    const spotifyToken = await getSpotifyToken();
    const spotifyHeaders = new Headers([
      ["Content-Type", "application/json"],
      ["Accept", "application/json"],
      ["Authorization", `Bearer ${spotifyToken}`],
    ]);

    const producerImg: HTMLImageElement = document.getElementById(
      "producer-image"
    ) as HTMLImageElement;
    producerImg.src = producerImgURL;
    producerImg.className = "rounded";
    const nameSection: HTMLElement = document.getElementById(
      "producer-name"
    ) as HTMLElement;
    nameSection.innerHTML = producerName;

    topSongs.forEach(async (song: any) => {
      const artistName = song.primary_artist.name;
      const spotifyResults = await searchSpotify(song.title, spotifyHeaders);

      const matchingResult = spotifyResults.find(
        (result: any) =>
          result.artists[0].name.toLowerCase() === artistName.toLowerCase()
      );

      if (!matchingResult) return;

      let songId = matchingResult.id;

      // Get song by songId to get preview URLs (search does not have preview URLs for most songs)
      const trackRequest = await fetch(
        `https://api.spotify.com/v1/tracks/${songId}?market=US`,
        {
          method: "GET",
          headers: spotifyHeaders,
        }
      );
      const trackInfo = await trackRequest.json();

      const displayArtist = trackInfo.artists[0].name;
      const displayTitle = trackInfo.name;
      const displayAlbum = trackInfo.album.name;
      const albumCover = trackInfo.album.images[2].url;
      songId = trackInfo.id;

      const li = document.createElement("li");
      li.className =
        "song-list list-none flex whitespace-nowrap items-center my-2 px-2 py-1 bg-white shadow-md rounded";
      li.innerHTML = `<img class="album-cover my-auto" src="${albumCover}" />
                                        <div class="my-auto text-sm overflow-hidden mr-5">
                                            <p class="font-semibold p-0 m-0 opacity-80">
                                                ${displayTitle}
                                            </p>
                                            <p class="text-xs p-0 m-0 opacity-60">
                                                ${displayArtist}
                                            </p>
                                            <p class="text-xs p-0 m-0 opacity-60">
                                                ${displayAlbum}
                                            </p>
                                        </div>`;
      const allBtnContainer = document.createElement("div");
      allBtnContainer.className = "flex ml-auto";
      const btnContainer = document.createElement("div");
      btnContainer.className = "flex items-center flex-end mr-1";
      if (trackInfo.preview_url) {
        const preview = trackInfo.preview_url;
        const previewBtn = document.createElement("button");
        previewBtn.className = "text-xl";
        // previewBtn.innerHTML = '&#9658;';
        previewBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mt-auto text-gray-500 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                      </svg>`;
        previewBtn.addEventListener("click", (e) => playPreview(e, preview));
        btnContainer.appendChild(previewBtn);

        const stopBtn = document.createElement("button");
        stopBtn.className = "mr-1 text-xl";
        stopBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-gray-500 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>`;
        stopBtn.addEventListener("click", () => stopSong());
        btnContainer.appendChild(stopBtn);
      }
      allBtnContainer.appendChild(btnContainer);

      if (isLoggedIn) {
        const addBtnContainer = document.createElement("div");
        addBtnContainer.className = "flex items-center";
        const addBtn = document.createElement("button");
        addBtn.className =
          "bg-blue-600 hover:bg-blue-700 px-2 rounded text-xl text-gray-200 font-semibold";
        addBtn.innerHTML = "+";
        addBtn.addEventListener("click", () => storeSongId(songId));
        addBtnContainer.appendChild(addBtn);
        allBtnContainer.appendChild(addBtnContainer);
      }

      li.appendChild(allBtnContainer);
      ul.appendChild(li);
    });
  };

  return (
    <div className="w-6/12 mx-auto rounded mt-10">
      <p className="mb-3">Search Song (include artist name for accuracy)</p>
      <div className="flex justify-center mb-10 mx-auto">
        <input
          id="song-search"
          type="text"
          placeholder="Song/Artist"
          className="text-box border-2 border-blue-600 rounded px-1"
        />
        <button
          onClick={() => search()}
          className="bg-blue-600 hover:bg-blue-700 rounded px-3 py-1 ml-3 text-white"
        >
          Search
        </button>
      </div>
      <div>
        <img className="hidden" id="producer-image" src="" alt="producer" />
      </div>
      <div
        id="producer-name"
        className="text-3xl text-center mt-2 mb-5 rounded"
      ></div>

      <div id="list-container" className="flex justify-center rounded">
        <img src="" alt="" />
      </div>
    </div>
  );
};
