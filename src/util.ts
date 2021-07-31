import { IBirdCard, IGameBoard, IGameState } from "./types";
import { birds } from "./birds.json";
import { v4 as uuidv4 } from "uuid"


export const Shuffle = (allCards: IBirdCard[]) => {
    let currentIndex = allCards.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [allCards[currentIndex], allCards[randomIndex]] = [allCards[randomIndex], allCards[currentIndex]];
    }
    return allCards;
}

//Creating card list from species
export const MakeCards = () => {

    let newCards: IBirdCard[] = [];

    birds.forEach(bird => {

        for (let i = 0; i < bird.count; i++) {
            newCards.push({ uid: uuidv4(), name: bird.name, smallFlock: bird.smallFlock, largeFlock: bird.largeFlock, imageFile: bird.imageFile } as IBirdCard)
        }
    });
    console.log(newCards);
}

export const SetupGame = (startDeck: IBirdCard[]): IGameState => {
    const deck = Shuffle(startDeck);
    const gameBoard: IGameBoard = [[], [], [], []]
    const discardPile: IBirdCard[] = [];
    const playerHand: IBirdCard[] = [];
    const playerFlocks: IBirdCard[] = [];

    // Setup gameboard
    gameBoard.forEach(row => {
        const usedSpecies: string[] = [];
        while (row.length < 3) {
            const card = deck.pop()!;
            if (usedSpecies.includes(card.name)) {
                discardPile.push(card)
            } else {
                row.push(card);
                usedSpecies.push(card.name)
            }
        }
    })

    // Deal cards to the player and add one card to his flock
    while (playerHand.length < 8) {
        playerHand.push(deck.pop()!)
    }

    playerHand.sort((a, b) => a.name > b.name ? 1 : -1)

    playerFlocks.push(deck.pop()!)


    return { deck, gameBoard, discardPile, playerHand, playerFlocks }
}

export const PlaceCards = (gameState: IGameState, usedCard: IBirdCard, row: number, side: "left" | "right"): IGameState => {
    let gameBoard = gameState.gameBoard;
    let playerHand = gameState.playerHand
    if (playerHand.some(card => card.uid === usedCard.uid)) {
        const usedCards = playerHand.filter(card => card.name === usedCard.name)
        // Add cards to the appropriate side of the row
        side === "left" ? gameBoard[row].unshift(...usedCards) : gameBoard[row].push(...usedCards);

        // Remove card from players hand
        playerHand = playerHand.filter(card => !usedCards.includes(card))
        if (playerHand.length < 1) {
            // New cards to all players
        }
        return {...gameState, gameBoard, playerHand}

    } else {
        throw "Card placement error: Used cards not found in player hand."
    }
}