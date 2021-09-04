import React from 'react';
// import { getSongId, getProducerId, getTopSongs } from '../GeniusLogic';
import { GeniusLogic } from '../../components';

interface Props{
    title: string;
}

export const Home = ( props:Props) => {
    return (
        <div>
            <h1 className="text-center text-5xl my-3 font-medium">ProducerFinder</h1>
            <GeniusLogic />
            {/* <form> */}
                {/* <input id="song-search" type="text" />
                <button onClick={() => clickEvent()}>Button</button> */}
            {/* </form> */}
        </div>
    )
}