import React from 'react';
// import { getSongId, getProducerId, getTopSongs } from '../GeniusLogic';
import { GeniusLogic } from '../../components';
import { CreatePlaylist } from '../CreatePlaylist';
import { Authorization } from '../Authorization/Authorization';
import { User } from '../User/User';

const code = new URLSearchParams(window.location.search).get('code');

interface Props{
    title: string;
}



export const Home = ( props:Props) => {
    return (
        <div className="container mx-auto text-center">
            <h1 className="text-5xl my-3 font-medium bg-gray-200 max-w-md py-5 mx-auto rounded">ProducerFinder</h1>
            
            {/* <User /> */}
            <div className="flex">
                <GeniusLogic />
                {/* <Authorization /> */}
                <CreatePlaylist />
                
            </div>
        </div>
    )
}

export const codeValue = () => {
    return (code)
};