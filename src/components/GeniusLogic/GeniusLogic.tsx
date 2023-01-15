import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectIsLoggedIn } from "..";
import { setAddSongId } from "./AddSongIdSlice";

const geniusToken = process.env.REACT_APP_GENIUS_ACCESS_TOKEN;
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

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

const searchSpotify = async (songTitle: string, headers: Headers) => {
  let request = await fetch(
    `https://api.spotify.com/v1/search?q=${songTitle}&type=track&market=US&limit=5`,
    {
      method: "GET",
      headers: headers,
    }
  );
  let response = await request.json();
  return response.tracks.items;
};

export const GeniusLogic = () => {
  const dispatch = useDispatch();
  const storeSongId = (songId: string) => {
    dispatch(setAddSongId(songId));
  };
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const getSpotifyToken = async () => {
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

  const search = async () => {
    const getSongId = async () => {
      let searchBox = document.getElementById(
        "song-search"
      ) as HTMLInputElement;
      let searchValue = searchBox.value;

      let request = await fetch(
        `https://api.genius.com/search?q=${searchValue}&access_token=${geniusToken}`,
        {
          method: "GET",
        }
      );
      let response = await request.json();
      let songId = response.response.hits[0].result.id;
      return songId;
    };

    let songId = await getSongId();

    const getProducerId = async () => {
      let request = await fetch(
        `https://api.genius.com/songs/${songId}?access_token=${geniusToken}`,
        {
          method: "GET",
        }
      );

      let response = await request.json();
      // TODO: instead of producer_artists[0], show dropdown of all producers and let user choose
      let producerId = response.response.song.producer_artists[0].id;
      let name = response.response.song.producer_artists[0].name;
      return [producerId, name];
    };

    let producerInfo = await getProducerId();
    let producerId = producerInfo[0];
    let producerName = producerInfo[1];

    const getProducerPic = async () => {
      let request = await fetch(
        `https://api.genius.com/artists/${producerId}?access_token=${geniusToken}`,
        {
          method: "GET",
        }
      );

      let response = await request.json();
      console.log("Producer info:");
      console.log(response.response.artist.image_url);
      return response.response.artist.image_url;
    };

    let producerPicURL = await getProducerPic();

    const getTopSongs = async () => {
      const request = await fetch(
        `https://api.genius.com/artists/${producerId}/songs?sort=popularity&access_token=${geniusToken}`,
        {
          method: "GET",
        }
      );

      const response = await request.json();
      // TODO: instead of producer_artists[0], show dropdown of all producers and let user choose
      const topSongs = response.response.songs;
      return topSongs;
    };

    const topSongs = await getTopSongs();

    const listContainer = document.getElementById("list-container")!;
    listContainer.innerHTML = `<ul id="list"></ul>`;
    let ul = document.getElementById("list")!;
    ul.className = "text-left";

    // Spotify =====================================================

    const spotifyToken = await getSpotifyToken();

    const headers = new Headers([
      ["Content-Type", "application/json"],
      ["Accept", "application/json"],
      ["Authorization", `Bearer ${spotifyToken}`],
    ]);

    let songTitle = "";

    const producerImg: HTMLImageElement = document.getElementById(
      "producer-image"
    ) as HTMLImageElement;
    producerImg.src = producerPicURL;
    producerImg.className = "rounded";
    const nameSection: HTMLElement = document.getElementById(
      "producer-name"
    ) as HTMLElement;
    nameSection.innerHTML = producerName;

    // loop through producer's top songs
    for (let i = 0; i < topSongs.length; i++) {
      songTitle = topSongs[i].title;
      const artistName = topSongs[i].primary_artist.name;
      const spotifyResults = await searchSpotify(songTitle, headers);

      const matchingResult = spotifyResults.find(
        (result: any) =>
          result.artists[0].name.toLowerCase() === artistName.toLowerCase()
      );

      if (!matchingResult) continue;

      let songId = matchingResult.id;

      // Get song by songId to get preview URLs (search does not have preview URLs for most songs)
      let trackRequest = await fetch(
        `https://api.spotify.com/v1/tracks/${songId}?market=US`,
        {
          method: "GET",
          headers: headers,
        }
      );
      let trackInfo = await trackRequest.json();
      // console.log(trackInfo);

      let displayArtist = trackInfo.artists[0].name;
      let displayTitle = trackInfo.name;
      let displayAlbum = trackInfo.album.name;
      let albumCover = trackInfo.album.images[2].url;
      songId = trackInfo.id;

      let li = document.createElement("li");
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
      let allBtnContainer = document.createElement("div");
      allBtnContainer.className = "flex ml-auto";
      let btnContainer = document.createElement("div");
      btnContainer.className = "flex items-center flex-end mr-1";
      if (trackInfo.preview_url) {
        let preview = trackInfo.preview_url;
        let previewBtn = document.createElement("button");
        previewBtn.className = "text-xl";
        // previewBtn.innerHTML = '&#9658;';
        previewBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mt-auto text-gray-500 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                      </svg>`;
        previewBtn.addEventListener("click", (e) => playPreview(e, preview));
        btnContainer.appendChild(previewBtn);

        let stopBtn = document.createElement("button");
        stopBtn.className = "mr-1 text-xl";
        stopBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-gray-500 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>`;
        stopBtn.addEventListener("click", () => stopSong());
        btnContainer.appendChild(stopBtn);
      }
      allBtnContainer.appendChild(btnContainer);

      if (isLoggedIn) {
        let addBtnContainer = document.createElement("div");
        addBtnContainer.className = "flex items-center";
        let addBtn = document.createElement("button");
        addBtn.className =
          "bg-blue-600 hover:bg-blue-700 px-2 rounded text-xl text-gray-200 font-semibold";
        addBtn.innerHTML = "+";
        addBtn.addEventListener("click", () => storeSongId(songId));
        addBtnContainer.appendChild(addBtn);
        allBtnContainer.appendChild(addBtnContainer);
      }

      li.appendChild(allBtnContainer);
      ul.appendChild(li);
    }
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
