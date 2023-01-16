import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProducerTopSongsList } from "../../components";
import { CreatePlaylist } from "../CreatePlaylist";
import { Authorization } from "../Authorization/Authorization";
import { User } from "../User/User";
import { selectIsLoggedIn } from "../Authorization";
import Search from "../Search/Search";
import ProducerImageAndName from "../ProducerImageAndName/ProducerImageAndName";

const geniusToken = process.env.REACT_APP_GENIUS_ACCESS_TOKEN;

const code = new URLSearchParams(window.location.search).get("code");

interface Props {
  title: string;
}

export const Home = (props: Props) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [searchedSongId, setSearchedSongId] = useState<string | null>(null);
  const [producerInfo, setProducerInfo] = useState<any>(null);

  useEffect(() => {
    if (!searchedSongId) return;
    const getProducerInfo = async (songId: string) => {
      const request = await fetch(
        `https://api.genius.com/songs/${songId}?access_token=${geniusToken}`,
        {
          method: "GET",
        }
      );

      const response = await request.json();
      // TODO: instead of producer_artists[0], show dropdown of all producers and let user choose
      setProducerInfo(response.response.song.producer_artists[0]);
    };

    getProducerInfo(searchedSongId);
  }, [searchedSongId]);

  return (
    <div className="container text-center mx-auto">
      <div className="flex items-start justify-between">
        <div className="invisible ml-auto">
          <Authorization />
          <User />
        </div>
        <h1 className="text-5xl my-3 font-medium bg-gray-200 max-w-md p-5 rounded">
          ProducerFinder
        </h1>
        <div className="ml-auto">
          <Authorization />
          <User />
        </div>
      </div>
      <div className="flex">
        <div className="w-6/12 mx-auto rounded mt-10">
          <Search setSearchedSongId={setSearchedSongId} />
          {searchedSongId && (
            <>
              <ProducerImageAndName producerInfo={producerInfo} />
              <ProducerTopSongsList producerInfo={producerInfo} />
            </>
          )}
        </div>
        {isLoggedIn && <CreatePlaylist />}
      </div>
    </div>
  );
};

export const codeValue = () => {
  return code;
};
