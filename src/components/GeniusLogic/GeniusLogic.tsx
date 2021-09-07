import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAddSongId } from './AddSongIdSlice';

const geniusToken = process.env.REACT_APP_GENIUS_ACCESS_TOKEN;
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

export const GeniusLogic = () => {
    const dispatch = useDispatch();
    const storeSongId = (songId:string) => {
        dispatch(setAddSongId(songId));
    }

    const getSpotifyToken = async () => {
        const result = await fetch('https://accounts.spotify.com/api/token',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });
        const data = await result.json();
        // console.log(data.access_token)
        return data.access_token
    };
    
    const search = async () => {
    
        const getSongId = async () => {
    
            let searchBox = (document.getElementById("song-search") as HTMLInputElement)
            let searchValue = searchBox.value;
    
            let request = await fetch(`https://api.genius.com/search?q=${searchValue}&access_token=${geniusToken}`, {
                method: 'GET',
            });
    
            let response = await request.json();
            // TODO: instead of hits[0], show dropdown of top hits and let user choose
            let songId = response.response.hits[0].result.id;
            return songId;
        }
    
        let songId = await getSongId();
        // console.log(`Song ID: ${songId}`);
    
        const getProducerId = async () => {
            let request = await fetch(`https://api.genius.com/songs/${songId}?access_token=${geniusToken}`, {
                method: 'GET',
            });
    
            let response = await request.json();
            // TODO: instead of producer_artists[0], show dropdown of all producers and let user choose
            let producerId = response.response.song.producer_artists[0].id;
            let name = response.response.song.producer_artists[0].name;
            return [producerId, name];
        }
    
        let producerInfo = await getProducerId();
        let producerId = producerInfo[0];
        let producerName = producerInfo[1];
        // console.log(`Producer ID: ${producerId}`);
        // console.log(`Producer Name: ${producerName}`);
    
        const getTopSongs = async () => {
            let request = await fetch(`https://api.genius.com/artists/${producerId}/songs?sort=popularity&access_token=${geniusToken}`, {
                method: 'GET',
            });
    
            let response = await request.json();
            // TODO: instead of producer_artists[0], show dropdown of all producers and let user choose
            let topSongsRaw = response.response.songs;
            let artists:string[] = [];
            let titles:string[] = [];
            for (let i = 0; i < topSongsRaw.length; i++) {
                let artist = topSongsRaw[i].primary_artist.name;
                artists.push(artist);
                let title = topSongsRaw[i].title;
                titles.push(title);
            }
            let topSongs = [artists, titles];
            return topSongs;
        }
    
        let topSongs = await getTopSongs();
        console.log(topSongs);
        let artists = topSongs[0];
        let songs = topSongs[1];
    
        const listContainer = document.getElementById('list-container')!;
        listContainer.innerHTML = `<ul id="list"></ul>`;
        let ul = document.getElementById('list')!;
    
        // Spotify
    
        let spotifyToken = await getSpotifyToken();
    
        let headers = new Headers([
            ['Content-Type', 'application/json'],
            ['Accept', 'application/json'],
            ['Authorization', `Bearer ${spotifyToken}`]
        ]);
    
        let songTitle = '';
    
        const searchSpotify = async () => {
            let request = await fetch(`https://api.spotify.com/v1/search?q=${songTitle}&type=track&market=US&limit=5`,{
                method: 'GET',
                headers: headers
            });
    
            let response = await request.json();
            // console.log(response.tracks.items);
            return response.tracks.items;
        }

        const playPreview = (preview:string) => {
            console.log(preview);
        }
    
        const nameSection: HTMLElement = document.getElementById('producer-name') as HTMLElement
        nameSection.innerHTML = producerName;
    
        for (let i=0; i < artists.length; i++) {
            songTitle = songs[i];
            let artistName = artists[i];
            let spotifyResults = await searchSpotify();
    
            for (let i=0; i < spotifyResults.length; i++) {
                if (spotifyResults[i].artists[0].name.toLowerCase() === artistName.toLowerCase()) {
                    let songId = spotifyResults[i].id;

                    // Get song by songId to get preview URLs (search does not have preview URLs for most songs)
                    let trackRequest = await fetch(`https://api.spotify.com/v1/tracks/${songId}?market=US`,{
                        method: 'GET',
                        headers: headers
                    });
                    let trackInfo = await trackRequest.json();
                    console.log(trackInfo);

                    // console.log(`${spotifyResults[i].artists[0].name} - ${spotifyResults[i].name}`)
                    // let displayArtist = spotifyResults[i].artists[0].name;
                    // let displayTitle = spotifyResults[i].name;
                    // let displayAlbum = spotifyResults[i].album.name;
                    // let albumCover = spotifyResults[i].album.images[2].url;
                    let displayArtist = trackInfo.artists[0].name;
                    let displayTitle = trackInfo.name;
                    let displayAlbum = trackInfo.album.name;
                    let albumCover = trackInfo.album.images[2].url;
                    songId = trackInfo.id;

                    let li = document.createElement('li');
                    li.className = "list-none flex items-center my-3";
                    li.innerHTML = `<img class="album-cover my-auto" src="${albumCover}" />
                                        <div class="my-auto text-sm">
                                            <p class="font-semibold p-0 m-0">
                                                ${displayTitle}
                                            </p>
                                            <p class="p-0 m-0">
                                                ${displayArtist}
                                            </p>
                                            <p class="p-0 m-0">
                                                ${displayAlbum}
                                            </p>
                                        </div>`

                    if (trackInfo.preview_url) {
                        let preview = trackInfo.preview_url;
                        let previewBtn = document.createElement('button');
                        previewBtn.className = "add-btn bg-blue-400 px-3 py-1 rounded ml-auto mr-3";
                        previewBtn.innerHTML = '+';
                        previewBtn.addEventListener('click', () => playPreview(preview))
                        li.appendChild(previewBtn);
                    }
                    
                    let addBtn = document.createElement('button');
                    addBtn.className = "add-btn bg-blue-400 px-3 py-1 rounded ml-auto mr-3";
                    addBtn.innerHTML = '+';
                    addBtn.addEventListener('click', () => storeSongId(songId))
                    li.appendChild(addBtn);
                    ul.appendChild(li);
                    break;
                }
            }
        }
    
    }

    return (
        <div className="w-6/12 mx-auto">
            <div className="flex justify-center my-10 mx-auto">
                <input id="song-search" type="text" placeholder="Song/Artist" className="border-2 border-gray-200 rounded" />
                <button onClick={() => search()} className="bg-blue-400 rounded px-3 py-1 ml-3">Search</button>
            </div>
            <h2 id="producer-name" className="text-3xl text-center mb-4"></h2>
            
            <div id="list-container" className="flex justify-center">
                <img src="" alt="" />
            </div>
            
        </div>
    )

}