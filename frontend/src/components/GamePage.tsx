import Header from "./Header";
import Market from "./Market";
import Sidebar from "./Sidebar";
import Row from "./Row";

function GamePage() {
  const cardImages = [
    "/cards/Ball_Hawk.png",
    "/cards/Bellcow.png",
    "/cards/Bellcow.png",
    "/cards/Punter.png",
    "/cards/Punter.png",
  ];

  return (
    <div className='flex flex-col h-screen'>
      <header className='p-4'>
        <Header
          playerName='Brian'
          opponentName='Billy'
          playerScore={78}
          opponentScore={82}
          opponentHandSize={4}
          currentTurnScore={7}
        />
      </header>
      <div className='flex-1 p-4 flex overflow-hidden'>
        <Market cardImages={cardImages} />
        <div className='flex-1 flex flex-col justify-between overflow-auto pl-4 pr-4 space-y-4'>
          <Row cards={cardImages} />
          <Row cards={cardImages} />
          <Row cards={cardImages} />
        </div>
        <Sidebar />
      </div>
    </div>
  );
}

export default GamePage;
