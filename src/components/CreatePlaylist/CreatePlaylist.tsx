import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAccessToken, selectIsLoggedIn } from '../Authorization/authorizationSlice';
import { selectUserId } from '../User/UserSlice';
import { setPlaylistName, setPlaylistId, selectPlaylistName } from './createPlaylistSlice';
import { Playlist } from '../Playlist';
import { useEffect } from 'react';

interface PlaylistsObject {
    [key: string]: string
}

const userPlaylists: PlaylistsObject = {'': '-- Select Playlist --'};

export const CreatePlaylist = () => {
    const isLoggedIn = useSelector(selectIsLoggedIn);
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
        document.getElementById("success")!.className = "text-white flex bg-green-400 border-2 px-3 ml-3 self-center rounded";
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
                userPlaylists[aPlaylistId] = aPlaylistName;
            }  
        }
        console.log(userPlaylists);
        let select = document.createElement('select');
        select.className = 'border-2 border-blue-600 rounded px-1'
        for (let [k,v] of Object.entries(userPlaylists)) {
            let option = document.createElement('option');
            option.value = k;
            option.innerText = v;
            select.appendChild(option);
        }
        document.getElementById('create-container')?.appendChild(select);
        select.addEventListener('change', (e) => {
            dispatch(setPlaylistId((e.target as HTMLSelectElement)!.value!));
            dispatch(setPlaylistName(userPlaylists[(e.target as HTMLSelectElement)!.value!]));
        });
        
    }

    useEffect(() => {
        if (userId) {
            getPlaylists()
        }
    }, [userId])

    return (
        <div className="w-6/12 mx-auto rounded">
            {isLoggedIn && <div className="flex justify-center my-10 mx-auto">
                <div id="create-container">
                    <p className="text-center mb-3">Create Spotify Playlist</p>
                    <div className="flex">
                        <input onChange={e => dispatch(setPlaylistName(e.target.value))} id="playlist-name-input" type="text" placeholder="Playlist Name" className="text-box border-2 border-blue-600 rounded px-1" />
                        <button onClick={createPlaylist} className="bg-blue-600 hover:bg-blue-700 rounded px-3 py-1 ml-3 text-white">Create</button>
                        <div id="success" className="hidden">
                            <p>&#10003;</p>
                            <p className="text-xs ml-3">Playlist<br />Created</p>
                        </div>
                    </div>
                    <p className="text-center my-9">- or -</p>
                    <p className="text-center mb-3">Choose Existing Playlist</p>
                </div>
            </div>}
            <Playlist />
        </div>
    )
}