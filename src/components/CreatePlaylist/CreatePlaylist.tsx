import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAccessToken } from '../../features/authorization/authorizationSlice';
import { selectUserId } from '../../features/spotifyExample/spotifyExampleSlice';
import { setPlaylistName, setPlaylistId, selectPlaylistName } from './createPlaylistSlice';
import { Playlist } from '../Playlist';
import { useEffect } from 'react';

interface PlaylistsObject {
    [key: string]: string
}

const userPlaylists: PlaylistsObject = {'Select Playlist': ''};

export const CreatePlaylist = () => {
    const accessToken = useSelector(selectAccessToken);
    const userId = useSelector(selectUserId);
    const playlistName = useSelector(selectPlaylistName);
    const dispatch = useDispatch();

    let headers = new Headers([
        ['Content-Type', 'application/json'],
        ['Accept', 'application/json'],
        ['Authorization', `Bearer ${accessToken}`]
    ]);

    const createPlaylist = async () => {
        const result = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
            method: 'POST',
            body: `{"name":"${playlistName}","public":true}`,
            headers: headers,
        });
        const data = await result.json();
        dispatch(setPlaylistId(data.id));
        (document.getElementById("playlist-name-input") as HTMLInputElement).value = '';
        document.getElementById("success")!.className = "bg-green-300 border-green-700 p-3";
        return data
    };

    const getPlaylists = async () => {
        const result = await fetch(`https://api.spotify.com/v1/me/playlists`,{
        method: 'GET',
        headers: headers,
        });
        const data = await result.json();
        let arrOfPlaylists = data.items;
        console.log(arrOfPlaylists.length);
        for (let i=0; i < arrOfPlaylists.length; i++) {
            if (arrOfPlaylists[i].owner.id === userId) {
                // need name to display in dropdown
                let aPlaylistName: string = arrOfPlaylists[i].name;
                // need id to get tracks in playlist
                let aPlaylistId: string = arrOfPlaylists[i].id;
                userPlaylists[aPlaylistName] = aPlaylistId;
            }  
        }
        console.log(userPlaylists);
        let select = document.createElement('select');
        for (let [k,v] of Object.entries(userPlaylists)) {
            let option = document.createElement('option');
            option.value = v;
            option.innerText = k;
            select.appendChild(option);
        }
        
        document.getElementById('create-container')?.appendChild(select);
        
        
    }

    useEffect(() => {
        if (userId) {
            getPlaylists()
        }
    }, [userId])

    return (
        <div className="w-6/12 mx-auto">
            <div className="flex justify-center my-10 mx-auto">
                <div id="create-container">
                    <h2 className="text-center">Create Spotify Playlist</h2>
                    <input onChange={e => dispatch(setPlaylistName(e.target.value))} id="playlist-name-input" type="text" placeholder="Playlist Name" className="border-2 border-gray-200 rounded" />
                    <button onClick={createPlaylist} className="bg-blue-400 rounded px-3 py-1 ml-3">Create</button>
                    <p id="success" className="hidden bg-green-300 border-green-700 p-3">Playlist Created</p>
                    <p className="text-center">- or -</p>
                    <h2 className="text-center">Choose Existing Playlist</h2>
                </div>
            </div>
            <Playlist />
        </div>
    )
}