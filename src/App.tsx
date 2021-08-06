import './App.css';
import { GameStateProvider } from './GameStateContext';

import GameBoard from './components/GameBoard';
import { SetupGame } from "./GameStateContext"
import cards from "./cards.json";
import PlayerHand from './components/PlayerHand';
import GameStatusBar from './components/GameStatusBar';

const startingGameState = SetupGame(cards);

function App() {

  return (
    <div className="App">
      <GameStateProvider gameState={startingGameState}>
        <GameStatusBar />
        <GameBoard />
        <PlayerHand />
      </GameStateProvider>
    </div>
  );
}

export default App;
