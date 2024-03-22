import React from "react";
import CardContainer from "./CardContainer";

interface RowProps {
  cards: string[]; // Array of URLs to the card images
}

const Row: React.FC<RowProps> = ({cards}) => {
  return (
    <div className='flex flex-1 border-red-500 border-8 rounded-md justify-center space-x-4 items-center'>
      {/* Placeholder for card components or images */}
      {cards.map((image, index) => (
        <CardContainer key={index} src={image} />
      ))}
    </div>
  );
};

export default Row;
