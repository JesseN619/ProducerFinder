import React from 'react';
// import { getSongId, getProducerId, getTopSongs } from '../GeniusLogic';
import { GeniusLogic } from '../../components';
import { Playlist } from '../Playlist';
import { Authorization } from '../../features/authorization/Authorization';
import { SpotifyExample } from '../../features/spotifyExample/spotifyExample';

const code = new URLSearchParams(window.location.search).get('code');

interface Props{
    title: string;
}



export const Home = ( props:Props) => {
    return (
        <div className="container mx-auto">
            <h1 className="text-center text-5xl my-3 font-medium">ProducerFinder</h1>
            <Authorization />
            <SpotifyExample />
            <div className="flex">
                <GeniusLogic />
                <Playlist />
            </div>
        </div>
    )
}

export const codeValue = () => {
    return (code)
};