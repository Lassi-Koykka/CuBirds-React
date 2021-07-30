export interface IBirdCard {
    uid: string,
    name: string,
    smallFlock: number,
    largeFlock: number,
    imageFile: string,
  }

export type IGameBoard = Array<Array<IGameCard>>;

export interface IGameState  {
    deck: IBirdCard[],
    discardPile: IBirdCard[],
    playerHand: IBirdCard[],
    playerFlocks: IBirdCard[],
    gameBoard: IGameBoard,
}
