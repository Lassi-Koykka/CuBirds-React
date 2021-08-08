import React, { createContext, ReactNode, useReducer } from "react";
import { GameActions } from "./Actions";
import { GameReducer } from "./GameReducer";
import { ICard, IGameBoard, IGameState, IPlayer } from "./types"

const ctxDefaultValue: {state: IGameState, dispatch: () => undefined} = {
    state: {
        deck: [] as ICard[],
        discardPile: [] as ICard[],
        cardsToPickup: [] as ICard[],
        gameBoard: [[], [], [], []] as IGameBoard,
        players: [] as IPlayer[],
        activePlayerID: 0,
        statusText: "",
        phase: "Put"
    },
    dispatch: () => undefined
}

export const GameStateContext = createContext<{ state: IGameState, dispatch: React.Dispatch<GameActions> }>(ctxDefaultValue);

export const GameStateProvider = (props: { gameState: IGameState, children?: ReactNode; }) => {
    const [state, dispatch] = useReducer(GameReducer, props.gameState);

    return (
        <GameStateContext.Provider value={{ state, dispatch }}>
            {props.children}
        </GameStateContext.Provider>
    )
}
