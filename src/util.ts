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
    let {deck, discardPile, playerHand, playerFlocks, gameBoard} = gameState
    
    if (playerHand.some(card => card.uid === usedCard.uid)) {
        const usedCards = playerHand.filter(card => card.name === usedCard.name)
        
        // Add cards to the appropriate side of the row and get the receive the birds in between
        let cardsReceived: IBirdCard[] = []
        if (side === "left") { 
            cardsReceived = gameBoard[row].splice(0, gameBoard[row].findIndex(card => card.name === usedCard.name))
            gameBoard[row].unshift(...usedCards)
        } else {
            const index = gameBoard[row].slice().reverse().findIndex((card: IBirdCard) => card.name === usedCard.name);
            
            if(index !== -1) {
                const count = gameBoard[row].length - 1
                const finalIndex = index >= 0 ? count - index : index;
                const takeFromEnd = -(gameBoard[row].length - finalIndex) + 1
                if(takeFromEnd < 0) cardsReceived = gameBoard[row].splice(takeFromEnd)
            }
                
            gameBoard[row].push(...usedCards);
        }

        // Remove card from players hand
        playerHand = playerHand.filter(card => !usedCards.includes(card))
        
        // Draw new cards to row if all the same species
        while(gameBoard[row].every(card => card.name === gameBoard[row][0].name)) {
            if(deck.length < 1) {
                deck = Shuffle(discardPile)
                discardPile = []
            }
            side === "left" ? gameBoard[row].push(deck.pop()!) : gameBoard[row].unshift(deck.pop()!)
            console.log("Adding card to " + (side === "left" ? "right" : "left"))
        }

        if (playerHand.length < 1) {
            // New cards to all players if the player chooses
        }

        if(cardsReceived.length > 0) {
            playerHand.push(...cardsReceived)
        } else {
            if(deck.length > 2) {
                playerHand.push(deck.pop()!)
                playerHand.push(deck.pop()!)
            } else {
                console.log("Reshuffling discard pile into a new deck")
                deck = Shuffle(discardPile)
                discardPile = []
            }
        }

        playerHand.sort((a, b) => a.name > b.name ? 1 : -1)

        return { deck, discardPile, gameBoard, playerHand, playerFlocks }

    } else {
        throw "Card placement error: Used cards not found in player hand."
    }
}