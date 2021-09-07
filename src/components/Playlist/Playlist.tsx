import { selectPlaylistName, selectPlaylistId } from "../CreatePlaylist/createPlaylistSlice";
import { selectAddSongId } from "../GeniusLogic/AddSongIdSlice";
import { selectAccessToken } from '../../features/authorization/authorizationSlice';
import { useEffect } from "react";
import { useSelector } from 'react-redux';

export const Playlist = () => {
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

    useEffect(() => {
        const playlistDisplayName = document.getElementById('playlist-name')!;
        playlistDisplayName.innerHTML = playlistName;
    }, [playlistId])

    const removeFromPlaylist = async (e: MouseEvent, songId:string) => {
        await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,{
            method: 'DELETE',
            body: `{\"tracks\":[{\"uri\":\"spotify:track:${songId}\"}]}`,
            headers: headers
        });
        let li1 = (e.target as Element).parentNode;
        (li1 as Element).remove();
    }

    useEffect(() => {
        const addToPlaylist = async () => {
            let playlistNameInput = (document.getElementById("playlist-name-input") as HTMLInputElement)
            console.log(playlistNameInput);
            let playlistName = playlistNameInput.value;
            console.log(playlistName);
            console.log(accessToken);

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
            li.className = "list-none border-t border-gray-400 flex items-center";
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
            let btn = document.createElement('button');
            btn.className = "add-btn bg-red-400 px-3 py-1 rounded ml-auto mr-3";
            btn.innerHTML = 'x';
            btn.addEventListener('click', (e) => removeFromPlaylist(e, songId))
            li.appendChild(btn);
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
            <ul id="playlist-ul" className="border-l border-r border-b border-gray-400 rounded"></ul>
        </div>
    )
}