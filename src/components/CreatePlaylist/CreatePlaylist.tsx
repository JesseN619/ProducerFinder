import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAccessToken } from '../../features/authorization/authorizationSlice';
import { selectUserId } from '../../features/spotifyExample/spotifyExampleSlice';
import { setPlaylistName, setPlaylistId, selectPlaylistName } from './createPlaylistSlice';
import { Playlist } from '../Playlist';

export const CreatePlaylist = () => {
    const accessToken = useSelector(selectAccessToken);
    const userId = useSelector(selectUserId);
    const playlistName = useSelector(selectPlaylistName);
    const dispatch = useDispatch();

    const createPlaylist = async () => {
        console.log(typeof(playlistName));
        console.log(`playlist name: ${playlistName}`);

        console.log(accessToken);
        const result = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
            method: 'POST',
            body: `{"name":"${playlistName}","public":true}`,
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
        return data
    };

    return (
        <div className="w-6/12 mx-auto">
            <div className="flex justify-center my-10 mx-auto">
                <div>
                    <h2 className="text-center">Create Spotify Playlist</h2>
                    <input onChange={e => dispatch(setPlaylistName(e.target.value))} id="playlist-name-input" type="text" placeholder="Playlist Name" className="border-2 border-gray-200 rounded" />
                    <button onClick={createPlaylist} className="bg-blue-400 rounded px-3 py-1 ml-3">Create</button>
                    <p className="text-center">- or -</p>
                </div>
            </div>
            <Playlist />
        </div>
    )
}