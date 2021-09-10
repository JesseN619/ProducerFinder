import { selectPlaylistName, selectPlaylistId } from "../CreatePlaylist/createPlaylistSlice";
import { selectAddSongId } from "../GeniusLogic/AddSongIdSlice";
import { selectAccessToken } from '../Authorization/authorizationSlice';
import { useEffect } from "react";
import { useSelector } from 'react-redux';

export const Playlist = () => {
    let accessToken = useSelector(selectAccessToken);
    let playlistId = useSelector(selectPlaylistId);
    let songId = useSelector(selectAddSongId);

    const ul = document.getElementById('playlist-ul')!;

    let headers = new Headers([
        ['Content-Type', 'application/json'],
        ['Accept', 'application/json'],
        ['Authorization', `Bearer ${accessToken}`]
    ]);

    const removeFromPlaylist = async (e: MouseEvent, songId:string) => {
        await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,{
            method: 'DELETE',
            body: `{"tracks":[{"uri":"spotify:track:${songId}"}]}`,
            headers: headers
        });
        let li1 = (e.target as Element).parentNode;
        (li1 as Element).remove();
    }

    // if playlist id changes, display playlist
    useEffect(() => {
        const displayPlaylist = async () => {
            // clear out prior playlist
            ul.innerHTML = '';
            // get playlist's items
            const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,{
                method: 'GET',
                headers: headers
            });
            const data = await result.json();
            console.log(data)
            let arrOfSongs = data.items;

            if (arrOfSongs.length !== 0) {
                // console.log(arrOfSongs)
                for (let i=0; i< arrOfSongs.length; i++) {
                    let displayArtist = arrOfSongs[i].track.artists[0].name;
                    let displayTitle = arrOfSongs[i].track.name;
                    let displayAlbum = arrOfSongs[i].track.album.name;
                    let albumCover = arrOfSongs[i].track.album.images[2].url;
                    let trackId = arrOfSongs[i].track.id;

                    let li = document.createElement('li');
                    li.className = "song-list list-none flex whitespace-nowrap items-center my-2 px-2 py-1 bg-white shadow-md rounded";
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
                                        </div>`

                    // delete btn
                    let delBtn = document.createElement('button');
                    delBtn.className = "bg-red-600 hover:bg-red-700 px-2 rounded text-xl text-gray-200 font-semibold ml-auto";
                    delBtn.innerHTML = 'x';
                    delBtn.addEventListener('click', (e) => removeFromPlaylist(e, trackId))
                    li.appendChild(delBtn);
                    ul.appendChild(li);
                }
            }
        }

        if (playlistId) {
            displayPlaylist();
        }
        
    }, [playlistId])

    // if addSongId changes
    useEffect(() => {
        const addToPlaylist = async () => {
            // Add song to playlist in Spotify database
            const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=spotify:track:${songId}`,{
                method: 'POST',
                headers: headers
            });
            const data = await result.json();
            console.log(data)

            // Retrieve info for that song
            const request = await fetch(`https://api.spotify.com/v1/tracks/${songId}?market=US`,{
                    method: 'GET',
                    headers: headers
                });
        
            let spotifyResults = await request.json();
            console.log(spotifyResults);

            // display playlist
            let displayArtist = spotifyResults.artists[0].name;
            let displayTitle = spotifyResults.name;
            let displayAlbum = spotifyResults.album.name;
            let albumCover = spotifyResults.album.images[2].url;

            let li = document.createElement('li');
            li.className = "song-list list-none flex whitespace-nowrap items-center my-2 px-2 py-1 bg-white shadow-md rounded";
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
                            </div>`

            let delBtn = document.createElement('button');
            delBtn.className = "bg-red-600 hover:bg-red-700 px-2 rounded text-xl text-gray-200 font-semibold ml-auto";
            delBtn.innerHTML = 'x';
            delBtn.addEventListener('click', (e) => removeFromPlaylist(e, songId))
            li.appendChild(delBtn);
            ul.appendChild(li);
        };

        
        if (playlistId === '') {
            console.log('Nothing here')
        } else {
            addToPlaylist();
        }
    }, [songId])

    return (
        <div className="w-6/12 mx-auto">
            <h2 id="playlist-name" className="text-3xl text-center mt-2 mb-5 rounded">{useSelector(selectPlaylistName)}</h2>
            <div id="list-container" className="flex justify-center rounded">
                <img src="" alt="" />
                <ul id="playlist-ul" className="text-left"></ul>
            </div>
            
            {/* <ul id="playlist-ul" className="border-l border-r border-b border-gray-400 rounded"></ul> */}
        </div>
    )
}