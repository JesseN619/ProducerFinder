import React from 'react';
import { useSelector } from 'react-redux';
import { GeniusLogic } from '../../components';
import { CreatePlaylist } from '../CreatePlaylist';
import { Authorization } from '../Authorization/Authorization';
import { User } from '../User/User';
import { selectIsLoggedIn } from '../Authorization';

const code = new URLSearchParams(window.location.search).get('code');

interface Props{
    title: string;
}



export const Home = ( props:Props) => {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    return (
        <div className="container text-center mx-auto">
            <div className="flex items-start justify-between">
                <div className="invisible ml-auto">
                    <Authorization />
                    <User />
                </div>
                <h1 className="text-5xl my-3 font-medium bg-gray-200 max-w-md p-5 rounded">ProducerFinder</h1>
                <div className="ml-auto">
                    <Authorization />
                    <User />
                </div>
            </div>
            <div className="flex">
                <GeniusLogic />
                {isLoggedIn && <CreatePlaylist />}
            </div>
        </div>
    )
}

export const codeValue = () => {
    return (code)
};