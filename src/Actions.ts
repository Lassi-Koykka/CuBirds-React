import { ICard, IPlayer } from "./types";

export enum ActionType {
    AddPlayer,
    SetupGame,
    ShuffleDeck,
    ShuffleDeckFromDiscard,
    SetMovingCards,
    PlaceCards,
    PickUpCards,
    DrawFromDeck,
    FillRowByOne,
    AddFlock,
    NextPhase,
    NextTurn,
    StartNewRound,
    SetStatusText
}

export interface AddPlayer {
    type: ActionType.AddPlayer,
    payload: IPlayer
}

export interface ShuffleDeck {
    type: ActionType.ShuffleDeck,
}

export interface ShuffleDeckFromDiscard {
    type: ActionType.ShuffleDeckFromDiscard,
}

export interface SetupGame {
    type: ActionType.SetupGame,
}

export interface SetMovingCards {
    type: ActionType.SetMovingCards,
    payload: {cards: ICard[]}
}

export interface PlaceCards {
    type: ActionType.PlaceCards,
    payload: {playerID: number, usedCard: ICard, side: "left" | "right", row: number}
}

export interface DrawFromDeck {
    type: ActionType.DrawFromDeck,
    payload: {playerID: number}
}

export interface PickUpCards {
    type: ActionType.PickUpCards,
    payload: {playerID: number, row: number}
}

export interface FillRowByOne {
    type: ActionType.FillRowByOne,
    payload: { row: number, side: "left" | "right" }
}

export interface AddFlock {
    type: ActionType.AddFlock,
    payload: {playerID: number, birdName: string, size: "small" | "large"}
}

export interface NextPhase {
    type: ActionType.NextPhase,
}

export interface NextTurn {
    type: ActionType.NextTurn
}

export interface StartNewRound {
    type: ActionType.StartNewRound,
    payload: { currPlayerId: number }
}

export interface SetStatusText {
    type: ActionType.SetStatusText,
    payload: string
}

export type GameActions = 
AddPlayer |
SetupGame |
ShuffleDeck |
ShuffleDeckFromDiscard |
SetMovingCards |
PlaceCards |
PickUpCards |
DrawFromDeck |
FillRowByOne |
AddFlock |
NextPhase |
NextTurn | 
StartNewRound |
SetStatusText