import React from 'react';
// import { getSongId, getProducerId, getTopSongs } from '../GeniusLogic';
import { GeniusLogic } from '../../components';
import { CreatePlaylist } from '../CreatePlaylist';
import { Authorization } from '../Authorization/Authorization';
import { SpotifyExample } from '../User/User';

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
                <CreatePlaylist />
            </div>
        </div>
    )
}

export const codeValue = () => {
    return (code)
};