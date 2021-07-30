import { IGameCard } from "./components/GameCard";
import { IBirdCard, IGameBoard, IGameState } from "./types";
import { birds } from "./birds.json";
import { v4 as uuidv4 } from "uuid"


export const shuffle = (allCards: IBirdCard[]) => {
    let currentIndex = allCards.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [allCards[currentIndex], allCards[randomIndex]] = [allCards[randomIndex], allCards[currentIndex]];
    }
    return allCards;
}

export const toGameCard = (card: IBirdCard): IGameCard => {
    return { title: card.name, description: card.smallFlock + "/" + card.largeFlock, frontImage: card.imageFile }
}

//Creating card list from species
export const makeCards = () => {

    let newCards: IBirdCard[] = [];

    birds.forEach(bird => {

        for (let i = 0; i < bird.count; i++) {
            newCards.push({ uid: uuidv4(), name: bird.name, smallFlock: bird.smallFlock, largeFlock: bird.largeFlock, imageFile: bird.imageFile } as IBirdCard)
        }
    });
    console.log(newCards);
}

export const setupGame = (startDeck: IBirdCard[]): IGameState => {
    const deck = shuffle(startDeck);
    const gameBoard: IGameBoard = [[],[],[],[]]
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

    playerFlocks.push(deck.pop()!)
    
    
    return { deck, gameBoard, discardPile, playerHand, playerFlocks }
}