import { createContext, useState, ReactNode } from "react";
import { IBirdCard, IGameBoard, IGameState } from "./types"


const ctxDefaultValue = {
    gameState: {
        deck: [] as IBirdCard[],
        discardPile: [] as IBirdCard[],
        playerHand: [] as IBirdCard[],
        playerFlocks: [] as IBirdCard[],
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