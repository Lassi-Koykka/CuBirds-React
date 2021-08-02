export interface ICard {
    uid: string,
    name: string,
    smallFlock: number,
    largeFlock: number,
    imageFile: string,
  }

export type IGameBoard = Array<Array<ICard>>;

export interface IGameState  {
    deck: ICard[],
    cardsMoved: ICard[],
    discardPile: ICard[],
    playerHand: ICard[],
    playerFlocks: ICard[],
    gameBoard: IGameBoard,
}
