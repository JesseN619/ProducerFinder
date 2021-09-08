import { selectPlaylistName, selectPlaylistId, setPlaylistName } from "../CreatePlaylist/createPlaylistSlice";
import { selectAddSongId } from "../GeniusLogic/AddSongIdSlice";
import { selectAccessToken } from '../../features/authorization/authorizationSlice';
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';

export const Playlist = () => {
    const dispatch = useDispatch();

    let accessToken = useSelector(selectAccessToken);
    let playlistId = useSelector(selectPlaylistId);
    let playlistName = useSelector(selectPlaylistName);
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
            body: `{\"tracks\":[{\"uri\":\"spotify:track:${songId}\"}]}`,
            headers: headers
        });
        let li1 = (e.target as Element).parentNode;
        (li1 as Element).remove();
    }

    // if playlist id changes, display playlist
    useEffect(() => {
        // const playlistDisplayName = document.getElementById('playlist-name')!;
        // playlistDisplayName.innerHTML = playlistName;

        

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

            // dispatch(setPlaylistName())

            if (arrOfSongs.length != 0) {
                // console.log(arrOfSongs)
                for (let i=0; i< arrOfSongs.length; i++) {
                    let displayArtist = arrOfSongs[i].track.artists[0].name;
                    let displayTitle = arrOfSongs[i].track.name;
                    let displayAlbum = arrOfSongs[i].track.album.name;
                    let albumCover = arrOfSongs[i].track.album.images[2].url;
                    let trackId = arrOfSongs[i].track.id;

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
                    // replace btn
                    // let replaceBtn = document.createElement('button');
                    // replaceBtn.className = "add-btn bg-yellow-400 px-3 py-1 rounded ml-auto mr-3";
                    // replaceBtn.innerHTML = 'x';
                    // replaceBtn.addEventListener('click', (e) => replace(e, songId))
                    // li.appendChild(replaceBtn);

                    // delete btn
                    let delBtn = document.createElement('button');
                    delBtn.className = "add-btn bg-red-400 px-3 py-1 rounded ml-auto mr-3";
                    delBtn.innerHTML = 'x';
                    delBtn.addEventListener('click', (e) => removeFromPlaylist(e, trackId))
                    li.appendChild(delBtn);
                    ul.appendChild(li);

                }
            }
        }

            // // Retrieve info for that song
            // const request = await fetch(`https://api.spotify.com/v1/tracks/${songId}?market=US`,{
            //         method: 'GET',
            //         headers: headers
            //     });
        
            // let spotifyResults = await request.json();
            // console.log(spotifyResults);
            

            // // display playlist
            // 

            // let li = document.createElement('li');
            // li.className = "list-none flex items-center my-3";
            // li.innerHTML = `<img class="album-cover my-auto" src="${albumCover}" />
            //                     <div class="my-auto text-sm">
            //                         <p class="font-semibold p-0 m-0">
            //                             ${displayTitle}
            //                         </p>
            //                         <p class="p-0 m-0">
            //                             ${displayArtist}
            //                         </p>
            //                         <p class="p-0 m-0">
            //                             ${displayAlbum}
            //                         </p>
            //                     </div>`
            // // replace btn
            // // let replaceBtn = document.createElement('button');
            // // replaceBtn.className = "add-btn bg-yellow-400 px-3 py-1 rounded ml-auto mr-3";
            // // replaceBtn.innerHTML = 'x';
            // // replaceBtn.addEventListener('click', (e) => replace(e, songId))
            // // li.appendChild(replaceBtn);

            // // delete btn
            // let delBtn = document.createElement('button');
            // delBtn.className = "add-btn bg-red-400 px-3 py-1 rounded ml-auto mr-3";
            // delBtn.innerHTML = 'x';
            // delBtn.addEventListener('click', (e) => removeFromPlaylist(e, songId))
            // li.appendChild(delBtn);
            // ul.appendChild(li);
        if (playlistId) {
            displayPlaylist();
        }
        
    }, [playlistId])

    useEffect(() => {
        const addToPlaylist = async () => {
            // let playlistNameInput = (document.getElementById("playlist-name-input") as HTMLInputElement)
            // console.log(playlistNameInput);
            // let playlistName = playlistNameInput.value;
            // console.log(playlistName);
            // console.log(accessToken);

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
            // replace btn
            // let replaceBtn = document.createElement('button');
            // replaceBtn.className = "add-btn bg-yellow-400 px-3 py-1 rounded ml-auto mr-3";
            // replaceBtn.innerHTML = 'x';
            // replaceBtn.addEventListener('click', (e) => replace(e, songId))
            // li.appendChild(replaceBtn);

            // delete btn
            let delBtn = document.createElement('button');
            delBtn.className = "add-btn bg-red-400 px-3 py-1 rounded ml-auto mr-3";
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
            <h2 id="playlist-name" className="text-3xl text-center mb-4">{useSelector(selectPlaylistName)}</h2>
            <ul id="playlist-ul"></ul>
            {/* <ul id="playlist-ul" className="border-l border-r border-b border-gray-400 rounded"></ul> */}
        </div>
    )
}