import { createContext, useState, ReactNode } from "react";
import { ICard, IGameBoard, IGameState } from "./types"


const ctxDefaultValue = {
    gameState: {
        deck: [] as ICard[],
        discardPile: [] as ICard[],
        playerHand: [] as ICard[],
        playerFlocks: [] as ICard[],
        cardsMoving: [] as ICard[],
        gameBoard: [[],[],[],[]] as IGameBoard,
    },
    setGameState: (value: IGameState) => {}
}

export const GameStateContext = createContext(ctxDefaultValue);

export const GameStateProvider = (props: { gameState: IGameState, children?: ReactNode; }) => {
    const [gameState, setGameState] = useState(props.gameState);

    return (
        <GameStateContext.Provider value={{gameState, setGameState}}>
            {props.children}
        </GameStateContext.Provider>
    )
}