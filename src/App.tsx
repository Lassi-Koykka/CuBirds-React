import './App.css';
import React, { useEffect, useState, createContext } from 'react';
import { Button } from '@material-ui/core';
import { GameStateProvider } from './GameStateContext';

import GameBoard from './components/GameBoard';
import { setupGame } from "./util"
import cards from "./cards.json";

const startingGameState = setupGame(cards);

function App() {

  return (
    <div className="App">
      <GameStateProvider gameState={startingGameState}>
        <GameBoard />
      </GameStateProvider>
    </div>
  );
}

export default App;
