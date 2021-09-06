import { selectPlaylistName, selectPlaylistId } from "../CreatePlaylist/createPlaylistSlice";
import { useEffect } from "react";
import { useSelector } from 'react-redux';

export const Playlist = () => {
    
    let playlistId = useSelector(selectPlaylistId);
    let playlistName = useSelector(selectPlaylistName);

    useEffect(() => {
        const playlistDisplayName = document.getElementById('playlist-name')!;
        playlistDisplayName.innerHTML = playlistName;
    }, [playlistId])


    return (
        <div className="w-6/12 mx-auto">
            <h2 id="playlist-name" className="text-3xl text-center mb-4"></h2>
            <ul id="playlist-ul"></ul>
        </div>
    )
}