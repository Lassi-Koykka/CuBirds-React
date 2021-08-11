import './App.css';
import { GameStateProvider } from './GameStateContext';

import { createMuiTheme, ThemeProvider } from "@material-ui/core"

import { SetupGame } from "./GameReducer"
import cards from "./cards.json";
import { MoveDataProvider } from './MoveDataContext';
import Game from './components/Game';

const startingGameState = SetupGame(cards);

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const App = () => {

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <GameStateProvider gameState={startingGameState}>
          <MoveDataProvider>
            <Game />
          </MoveDataProvider>
        </GameStateProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
