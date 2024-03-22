import React from "react";
import CardContainer from "./CardContainer";
import {useState} from "react";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  // State to manage the score
  const [score, setScore] = useState(0);

  // Handlers for button clicks
  const incrementScoreByFive = () => {
    setScore(score + 5);
    console.log(score);
  };
  const incrementScoreByOne = () => setScore(score + 1);
  const endTurn = () => {
    console.log("Turn ended"); // Implement turn-ending logic here
    // Optionally reset the score or handle other turn-end logic
  };

  return (
    <div className='h-full w-1/12 overflow-auto border-8 border-green-500 p-4 flex flex-col gap-4 rounded-lg shadow-md items-center'>
      <button
        className='bg-blue-500 text-white p-2 rounded-md'
        onClick={incrementScoreByFive}
      >
        Increment Score by 5
      </button>
      <button
        className='bg-blue-500 text-white p-2 rounded-md'
        onClick={incrementScoreByOne}
      >
        Increment Score by 1
      </button>
      <button
        className='bg-blue-500 text-white p-2 rounded-md'
        onClick={endTurn}
      >
        End Turn
      </button>
      <button
        className='bg-blue-500 text-white p-2 rounded-md'
        onClick={endTurn}
      >
        Draw Card
      </button>
      <div className='text-center'>Score: {score}</div>
      <div className='text-center'>Discard</div>
      <CardContainer src='/cards/Punter.png' />
    </div>
  );
};

export default Sidebar;
