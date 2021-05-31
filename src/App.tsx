import React from 'react';
import './App.css';
import DropZone from "./components/DropZone"
import {IGameCard} from "./components/GameCard"


function App() {
  const startingCard: IGameCard = {title: "Example GameCard", description: "This is an example playcard for my game"}

  return (
    <div className="App">
      <DropZone cardData={startingCard} />
      <DropZone />
    </div>
  );
}

export default App;
