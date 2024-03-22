import React from "react";
import {useState} from "react";

interface CardContainerProps {
  src: string;
}

const CardContainer: React.FC<CardContainerProps> = ({src}) => {
  const [clickState, setClickState] = useState(0);

  const toggleClickState = () => {
    setClickState((current) => (current + 1) % 3);
  };

  return (
    <div
      className='w-48 h-72 relative justify-center items-center overflow-hidden bg-white rounded-sm shadow-sm'
      style={{width: "120px", height: "180px"}}
      onClick={toggleClickState}
    >
      <img
        src={src}
        alt='Card'
        className='max-w-full max-h-full'
        style={{objectFit: "contain"}}
      />
      {clickState == 1 && (
        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-10'>
          <span className='text-red-500 text-6xl'>X</span>
        </div>
      )}
      {clickState == 2 && (
        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-10'>
          <span className='text-green-500 text-6xl'>&#10003;</span>
        </div>
      )}
    </div>
  );
};

export default CardContainer;
