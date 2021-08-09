export interface ICard {
  uid: string,
  name: string,
  smallFlock: number,
  largeFlock: number,
  imageFile: string,
}

export type IGameBoard = Array<Array<ICard>>;

export interface IActor {
  id: number,
  isClient?: boolean,
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
  actors: IActor[],
  currActorID: number,
  phase: "Put" | "Get" | "Fill" | "Flock";
}

