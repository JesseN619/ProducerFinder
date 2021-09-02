import React from 'react';

let token = process.env.REACT_APP_GENIUS_ACCESS_TOKEN

const clickEvent = async () => {

    const getSongId = async () => {

        let searchBox = (document.getElementById("song-search") as HTMLInputElement)
        console.log(searchBox);
        let searchValue = searchBox.value;
        console.log(searchValue);

        let request = await fetch(`https://api.genius.com/search?q=${searchValue}&access_token=${token}`, {
            method: 'GET',
        });

        // let request = await fetch(`https://api.genius.com/search?q=Kendrick%20Lamar%20hiiipower&access_token=${token}`, {
        //     method: 'GET',
        // });

        let response = await request.json();
        // TODO: instead of hits[0], show dropdown of top hits and let user choose
        let songId = response.response.hits[0].result.id;
        return songId;
    }

    let songId = await getSongId();
    console.log(`Song ID: ${songId}`);

    const getProducerId = async () => {
        let request = await fetch(`https://api.genius.com/songs/${songId}?access_token=${token}`, {
            method: 'GET',
        });

        let response = await request.json();
        // TODO: instead of producer_artists[0], show dropdown of all producers and let user choose
        let producerId = response.response.song.producer_artists[0].id;
        return producerId;
    }

    let producerId = await getProducerId();
    console.log(`Producer ID: ${producerId}`);

    const getTopSongs = async () => {
        let request = await fetch(`https://api.genius.com/artists/${producerId}/songs?sort=popularity&access_token=${token}`, {
            method: 'GET',
        });

        let response = await request.json();
        // TODO: instead of producer_artists[0], show dropdown of all producers and let user choose
        let topSongsRaw = response.response.songs;
        let artists:string[] = [];
        let titles:string[] = [];
        for (let i = 0; i < topSongsRaw.length; i++) {
            let artist = topSongsRaw[i].primary_artist.name;
            artists.push(artist);
            let title = topSongsRaw[i].title;
            titles.push(title);
            // console.log(`${title} - ${artist}`)
        }
        let topSongs = [artists, titles];
        return topSongs;
    }

    let topSongs = await getTopSongs();
    console.log(topSongs);
}
    

export const GeniusLogic = () => {

    return (
        <div>
            <input id="song-search" type="text" />
            <button onClick={() => clickEvent()}>Button</button>
        </div>
    )

}