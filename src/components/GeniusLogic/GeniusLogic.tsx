import React from 'react';

let token = process.env.REACT_APP_GENIUS_ACCESS_TOKEN

const search = async () => {

    const getSongId = async () => {

        let searchBox = (document.getElementById("song-search") as HTMLInputElement)
        console.log(searchBox);
        let searchValue = searchBox.value;
        console.log(searchValue);

        let request = await fetch(`https://api.genius.com/search?q=${searchValue}&access_token=${token}`, {
            method: 'GET',
        });

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
        let name = response.response.song.producer_artists[0].name;
        return [producerId, name];
    }

    let producerInfo = await getProducerId();
    let producerId = producerInfo[0];
    let producerName = producerInfo[1];
    console.log(`Producer ID: ${producerId}`);
    console.log(`Producer Name: ${producerName}`);

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
    let artists = topSongs[0];
    let songs = topSongs[1];
    for (let i=0; i < artists.length; i++) {
        console.log(`${artists[i]} - ${songs[i]}`)
    }

    

    const nameSection: HTMLElement = document.getElementById('producer-name') as HTMLElement
    nameSection.innerHTML = producerName;

}
    

export const GeniusLogic = () => {

    return (
        <div>
            <input id="song-search" type="text" />
            <button onClick={() => search()}>Button</button>
            <h1 id="producer-name"></h1>
        </div>
    )

}