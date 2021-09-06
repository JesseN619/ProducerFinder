import { selectPlaylistName, selectPlaylistId } from "../CreatePlaylist/createPlaylistSlice";
import { selectSongId } from "../GeniusLogic/SongIdSlice";
import { selectAccessToken } from '../../features/authorization/authorizationSlice';
import { useEffect } from "react";
import { useSelector } from 'react-redux';

export const Playlist = () => {
    let accessToken = useSelector(selectAccessToken);
    let playlistId = useSelector(selectPlaylistId);
    let playlistName = useSelector(selectPlaylistName);
    let songId = useSelector(selectSongId);

    useEffect(() => {
        const playlistDisplayName = document.getElementById('playlist-name')!;
        playlistDisplayName.innerHTML = playlistName;
    }, [playlistId])

    useEffect(() => {
        const addToPlaylist = async () => {
            let playlistNameInput = (document.getElementById("playlist-name-input") as HTMLInputElement)
            console.log(playlistNameInput);
            let playlistName = playlistNameInput.value;
            console.log(playlistName);
    
            console.log(accessToken);
            const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=spotify:track:${songId}`,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
            });
            const data = await result.json();
            console.log(data)
            return data
        };
        addToPlaylist();
    }, [songId])

    return (
        <div className="w-6/12 mx-auto">
            <h2 id="playlist-name" className="text-3xl text-center mb-4"></h2>
            <ul id="playlist-ul"></ul>
        </div>
    )
}