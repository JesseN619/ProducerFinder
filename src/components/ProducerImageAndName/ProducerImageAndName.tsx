import { useEffect, useState } from "react";

const geniusToken = process.env.REACT_APP_GENIUS_ACCESS_TOKEN;

interface ProducerImageAndNameListProps {
  producerInfo: any;
}

export default function ProducerImageAndName(
  props: ProducerImageAndNameListProps
) {
  const { producerInfo } = props;
  const [producerImgURL, setProducerImgURL] = useState<string | null>(null);

  const producerId = producerInfo ? producerInfo.id : null;
  const producerName = producerInfo ? producerInfo.name : null;

  useEffect(() => {
    if (!producerId) return;
    const getProducerImgURLFromGenius = async (producerId: string) => {
      const request = await fetch(
        `https://api.genius.com/artists/${producerId}?access_token=${geniusToken}`,
        {
          method: "GET",
        }
      );

      const response = await request.json();
      const producerImgURL = response.response.artist.image_url;
      setProducerImgURL(producerImgURL);
    };

    getProducerImgURLFromGenius(producerId);
  }, [producerId]);

  if (!producerImgURL) return null;

  return (
    <>
      <div>
        <img
          className="rounded"
          id="producer-image"
          src={producerImgURL}
          alt="producer"
        />
      </div>
      <div
        id="producer-name"
        className="text-3xl text-center mt-2 mb-5 rounded"
      >
        {producerName}
      </div>
    </>
  );
}
