import React from "react";
import CardContainer from "./CardContainer";

interface MarketProps {
  cardImages: string[]; // Array of URLs to the card images
}

const Market: React.FC<MarketProps> = ({cardImages}) => {
  return (
    <div className='h-full overflow-auto border-8 border-blue-500 p-4 grid grid-cols-2 gap-4 rounded-lg shadow-md flex-initial'>
      {cardImages.map((image, index) => (
        <CardContainer key={index} src={image} />
      ))}
    </div>
  );
};

export default Market;
