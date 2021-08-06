export interface ICard {
  uid: string,
  name: string,
  smallFlock: number,
  largeFlock: number,
  imageFile: string,
}

export type IGameBoard = Array<Array<ICard>>;

export interface IPlayer {
  id: number,
  name: string,
  hand: ICard[],
  flocks: ICard[],
}

export interface IGameState {
  statusText: string,
  deck: ICard[],
  discardPile: ICard[],
  cardsToPickup: ICard[],
  gameBoard: IGameBoard,
  players: IPlayer[],
  activePlayerID: number,
}

