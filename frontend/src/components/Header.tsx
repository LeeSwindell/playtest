import React from "react";

interface HeaderProps {
  playerName: string;
  opponentName: string;
  playerScore: number;
  opponentScore: number;
  opponentHandSize: number;
  currentTurnScore: number;
}

const Header: React.FC<HeaderProps> = ({
  playerName,
  opponentName,
  playerScore,
  opponentScore,
  opponentHandSize,
  currentTurnScore,
}) => {
  return (
    <div className='bg-blue-600 text-white p-4 rounded-lg shadow-md'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-lg font-bold'>Player: {playerName}</h1>
          <p>Score: {playerScore}</p>
        </div>
        <div>
          <h1 className='text-lg font-bold'>Opponent: {opponentName}</h1>
          <p>Score: {opponentScore}</p>
          <p>Hand Size: {opponentHandSize}</p>
        </div>
      </div>
      <div className='mt-4'>
        <h2 className='text-md font-semibold'>
          Current Yards: {currentTurnScore}
        </h2>
      </div>
    </div>
  );
};

export default Header;
