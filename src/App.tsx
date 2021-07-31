import './App.css';
import { GameStateProvider } from './GameStateContext';

import GameBoard from './components/GameBoard';
import { SetupGame } from "./util"
import cards from "./cards.json";
import PlayerHand from './components/PlayerHand';

const startingGameState = SetupGame(cards);

function App() {

  return (
    <div className="App">
      <GameStateProvider gameState={startingGameState}>
        <GameBoard />
        <PlayerHand />
      </GameStateProvider>
    </div>
  );
}

export default App;
