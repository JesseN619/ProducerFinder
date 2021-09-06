import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAccessToken } from '../../features/authorization/authorizationSlice';
import { selectUserId } from '../../features/spotifyExample/spotifyExampleSlice';
import { setPlaylistName, setPlaylistId } from './createPlaylistSlice';
import { Playlist } from '../Playlist';

export const CreatePlaylist = () => {
    const accessToken = useSelector(selectAccessToken);
    const userId = useSelector(selectUserId);
    const dispatch = useDispatch();

    const createPlaylist = async () => {
        let playlistNameInput = (document.getElementById("playlist-name-input") as HTMLInputElement)
        console.log(playlistNameInput);
        let playlistName = playlistNameInput.value;
        console.log(playlistName);

        console.log(accessToken);
        const result = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
            method: 'POST',
            // body: `{\"name\":${playlistName},\"public\":true}`,
            body: "{\"name\":\"hello\",\"public\":true}",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
        });
        const data = await result.json();
        console.log(data)
        console.log(data.id)
        dispatch(setPlaylistId(data.id));
        dispatch(setPlaylistName(data.name));
        return data
    };

    return (
        <div className="w-6/12 mx-auto">
            <h2 className="text-center">Create Spotify Playlist</h2>
            <div className="flex justify-center my-10 mx-auto">
                <div>
                    <input id="playlist-name-input" type="text" placeholder="Playlist Name" className="border-2 border-gray-200 rounded" />
                    <button onClick={() => createPlaylist()} className="bg-blue-400 rounded px-3 py-1 ml-3">Create</button>
                </div>
            </div>
            <h2 id="producer-name" className="text-3xl text-center mb-4"></h2>
            
            {/* <div id="list-container" className="flex justify-center">
                <img src="" alt="" />
            </div> */}
            <Playlist />
        </div>
    )
}