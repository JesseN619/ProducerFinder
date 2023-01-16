import { useState } from "react";

interface SearchProps {
  setSearchedSongId: (songId: string | null) => void;
}

export default function Search(props: SearchProps) {
  const { setSearchedSongId } = props;
  const [searchValue, setSearchValue] = useState("");

  const geniusToken = process.env.REACT_APP_GENIUS_ACCESS_TOKEN;

  const getGeniusSongIdWithSearch = async (searchValue: string) => {
    const request = await fetch(
      `https://api.genius.com/search?q=${searchValue}&access_token=${geniusToken}`,
      {
        method: "GET",
      }
    );
    const response = await request.json();
    const songId = response.response.hits[0].result.id;
    setSearchedSongId(songId);
  };

  return (
    <>
      <p className="mb-3">Search Song (include artist name for accuracy)</p>
      <div className="flex justify-center mb-10 mx-auto">
        <input
          id="song-search"
          type="text"
          placeholder="Song/Artist"
          className="text-box border-2 border-blue-600 rounded px-1"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button
          onClick={() => getGeniusSongIdWithSearch(searchValue)}
          className="bg-blue-600 hover:bg-blue-700 rounded px-3 py-1 ml-3 text-white"
        >
          Search
        </button>
      </div>
    </>
  );
}
