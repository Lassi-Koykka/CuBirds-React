import './App.css';
import { GameStateProvider } from './GameStateContext';

import { SetupGame } from "./GameReducer"
import cards from "./cards.json";
import { MoveDataProvider } from './MoveDataContext';
import Game from './components/Game';

const startingGameState = SetupGame(cards);

const App = () => {

  return (
    <div className="App">
      <GameStateProvider gameState={startingGameState}>
        <MoveDataProvider>
          <Game/>
        </MoveDataProvider>
      </GameStateProvider>
    </div>
  );
}

export default App;
