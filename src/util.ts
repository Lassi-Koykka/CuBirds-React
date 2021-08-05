import { ICard, IGameBoard, IGameState } from "./types";
import { birds } from "./birds.json";
import { v4 as uuidv4 } from "uuid"

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const Shuffle = (allCards: ICard[]) => {
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

    let newCards: ICard[] = [];

    birds.forEach(bird => {

        for (let i = 0; i < bird.count; i++) {
            newCards.push({ uid: uuidv4(), name: bird.name, smallFlock: bird.smallFlock, largeFlock: bird.largeFlock, imageFile: bird.imageFile } as ICard)
        }
    });
    console.log(newCards);
}




export const SetupGame = (startDeck: ICard[]): IGameState => {
    const deck = Shuffle(startDeck);
    const gameBoard: IGameBoard = [[], [], [], []]
    const discardPile: ICard[] = [];
    const playerHand: ICard[] = [];
    const playerFlocks: ICard[] = [];

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


    return { deck, gameBoard, cardsMoving: [], discardPile, playerHand, playerFlocks, statusText: "" }
}





export const PlaceCards = async (gameState: IGameState, setGameState: (gameState: IGameState) => void, usedCard: ICard, row: number, side: "left" | "right") => {
    let { deck, discardPile, playerHand, playerFlocks, gameBoard } = gameState
    let statusText = ""

    if (playerHand.some(card => card.uid === usedCard.uid)) {

        //  PLACE CARDS FROM HAND TO THE TABLE

        let receivedCards: ICard[] = []
        const usedCards = playerHand.filter(card => card.name === usedCard.name)
        const currRow = gameBoard[row]
        const rowAfter = [...gameBoard[row]];

        // Add cards to the appropriate side of the row

        if (side === "left") {
            receivedCards = rowAfter.splice(0, rowAfter.findIndex(card => card.name === usedCard.name))
            currRow.unshift(...usedCards)
            rowAfter.unshift(...usedCards)
        } else {
            const index = rowAfter.slice().reverse().findIndex((card: ICard) => card.name === usedCard.name);

            if (index !== -1) {
                const count = rowAfter.length - 1
                const finalIndex = index >= 0 ? count - index : index;
                const takeFromEnd = -(rowAfter.length - finalIndex) + 1
                if (takeFromEnd < 0) receivedCards = rowAfter.splice(takeFromEnd);
            }

            currRow.push(...usedCards);
            rowAfter.push(...usedCards)
        }

        // Remove card from players hand
        playerHand = playerHand.filter(card => !usedCards.includes(card))

        statusText = "Placing Cards..."

        setGameState({ deck, discardPile, cardsMoving: receivedCards, gameBoard, playerHand, playerFlocks, statusText })

        await delay(1000);


        // MOVE RECEIVED CARDS FROM TABLE TO PLAYERS HAND

        gameBoard[row] = rowAfter;

        if (receivedCards.length > 0) {
            statusText = "Getting Cards..."
            playerHand.push(...receivedCards)
        } else {

            // IF PLAYER IS OUT OF CARDS
            if (playerHand.length < 1) {
                // New cards to all players if the player so chooses
                let answer = window.confirm("Confirm to start a new round. Otherwise you will draw two cards from the deck");

                if (!answer) {

                    statusText = "Drawing cards from deck..."

                    let card1, card2;

                    if (deck.length > 2) {
                        card1 = deck.pop()!
                        card2 = deck.pop()!
                        playerHand.push(card1)
                        playerHand.push(card2)
                    } else {
                        console.log("Reshuffling discard pile into a new deck")
                        deck = Shuffle(discardPile)
                        discardPile = []

                        card1 = deck.pop()!
                        card2 = deck.pop()!
                        playerHand.push(card1)
                        playerHand.push(card2)
                    }
                } else {
                    console.log("NEW ROUND")
                }
            } else {

                statusText = "Drawing cards from deck..."

                let card1, card2;

                if (deck.length > 2) {
                    card1 = deck.pop()!
                    card2 = deck.pop()!
                    playerHand.push(card1)
                    playerHand.push(card2)
                } else {
                    console.log("Reshuffling discard pile into a new deck")
                    deck = Shuffle(discardPile)
                    discardPile = []

                    card1 = deck.pop()!
                    card2 = deck.pop()!
                    playerHand.push(card1)
                    playerHand.push(card2)
                }
            }

        }

        playerHand.sort((a, b) => a.name > b.name ? 1 : -1)

        setGameState({ deck, discardPile, cardsMoving: [], gameBoard, playerHand, playerFlocks, statusText });

        await delay(1000)


        // DRAW NEW CARDS TO TABLE

        // Draw new cards to row if all the same species
        while (gameBoard[row].every(card => card.name === gameBoard[row][0].name)) {
            if (deck.length < 1) {
                deck = Shuffle(discardPile)
                discardPile = []
            }
            let newCard = deck.pop()!
            side === "left" ? gameBoard[row].push(newCard) : gameBoard[row].unshift(newCard)
            console.log("Adding card to " + (side === "left" ? "right" : "left"))

            statusText = "Drawing new cards from the deck to the table..."

            setGameState({ deck, discardPile, cardsMoving: [], gameBoard, playerHand, playerFlocks, statusText });

            await delay(1000);
        }


        //return { deck, discardPile, gameBoard, playerHand, playerFlocks }

    } else {
        throw Error("Card placement error: Used cards not found in player hand.");
    }
}