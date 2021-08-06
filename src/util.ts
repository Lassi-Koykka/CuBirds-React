import { ICard, IGameBoard, IGameState, IPlayer } from "./types";
import { birds } from "./birds.json";
import { v4 as uuidv4 } from "uuid"

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));




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

// // OLD FUNCTION

// export const HandlePlayerMove = async (playerID: number, usedCard: ICard, row: number, side: "left" | "right", gameState: IGameState,) => {
//     let { deck, discardPile, players, gameBoard } = gameState
//     let { hand: playerHand, flocks: playerFlocks } = players.find(p => p.id === playerID)!;

//     if (playerHand.some(card => card.uid === usedCard.uid)) {

//         //  PLACE CARDS FROM HAND TO THE TABLE

//         let receivedCards: ICard[] = []
//         const usedCards = playerHand.filter(card => card.name === usedCard.name)
//         const currRow = gameBoard[row]
//         const rowAfter = [...gameBoard[row]];

//         // Add cards to the appropriate side of the row

//         if (side === "left") {
//             receivedCards = rowAfter.splice(0, rowAfter.findIndex(card => card.name === usedCard.name))
//             currRow.unshift(...usedCards)
//             rowAfter.unshift(...usedCards)
//         } else {
//             const index = rowAfter.slice().reverse().findIndex((card: ICard) => card.name === usedCard.name);

//             if (index !== -1) {
//                 const count = rowAfter.length - 1
//                 const finalIndex = index >= 0 ? count - index : index;
//                 const takeFromEnd = -(rowAfter.length - finalIndex) + 1
//                 if (takeFromEnd < 0) receivedCards = rowAfter.splice(takeFromEnd);
//             }

//             currRow.push(...usedCards);
//             rowAfter.push(...usedCards)
//         }

//         // Remove card from players hand
//         playerHand = playerHand.filter(card => !usedCards.includes(card))

//         setGameState({ deck, discardPile, cardsMoving: receivedCards, gameBoard, playerHand, playerFlocks, statusText })



//         // MOVE RECEIVED CARDS FROM TABLE TO PLAYERS HAND

//         gameBoard[row] = rowAfter;


//         statusText = "Getting Cards..."
//         playerHand.push(...receivedCards)
//     } else {

//         // IF PLAYER IS OUT OF CARDS
//         if (playerHand.length < 1) {
//             // New cards to all players if the player so chooses
//             let answer = window.confirm("Confirm to start a new round. Otherwise you will draw two cards from the deck");

//             if (!answer) {

//                 statusText = "Drawing cards from deck..."

//                 let card1, card2;

//                 if (deck.length > 2) {
//                     card1 = deck.pop()!
//                     card2 = deck.pop()!
//                     playerHand.push(card1)
//                     playerHand.push(card2)
//                 } else {
//                     console.log("Reshuffling discard pile into a new deck")
//                     deck = Shuffle(discardPile)
//                     discardPile = []

//                     card1 = deck.pop()!
//                     card2 = deck.pop()!
//                     playerHand.push(card1)
//                     playerHand.push(card2)
//                 }
//             } else {
//                 console.log("NEW ROUND")
//             }
//         } else {

//             statusText = "Drawing cards from deck..."

//             let card1, card2;

//             if (deck.length > 2) {
//                 card1 = deck.pop()!
//                 card2 = deck.pop()!
//                 playerHand.push(card1)
//                 playerHand.push(card2)
//             } else {
//                 console.log("Reshuffling discard pile into a new deck")
//                 deck = Shuffle(discardPile)
//                 discardPile = []

//                 card1 = deck.pop()!
//                 card2 = deck.pop()!
//                 playerHand.push(card1)
//                 playerHand.push(card2)
//             }
//         }

//     }

//     playerHand.sort((a, b) => a.name > b.name ? 1 : -1)

//     setGameState({ deck, discardPile, cardsMoving: [], gameBoard, playerHand, playerFlocks, statusText });

//     await delay(1000)


//     // DRAW NEW CARDS TO TABLE

//     // Draw new cards to row if all the same species
//     while (gameBoard[row].every(card => card.name === gameBoard[row][0].name)) {
//         if (deck.length < 1) {
//             deck = Shuffle(discardPile)
//             discardPile = []
//         }
//         let newCard = deck.pop()!
//         side === "left" ? gameBoard[row].push(newCard) : gameBoard[row].unshift(newCard)
//         console.log("Adding card to " + (side === "left" ? "right" : "left"))

//         statusText = "Drawing new cards from the deck to the table..."

//         setGameState({ deck, discardPile, cardsMoving: [], gameBoard, playerHand, playerFlocks, statusText });

//         await delay(1000);
//     }


//     //return { deck, discardPile, gameBoard, playerHand, playerFlocks }

// } else {
//     throw Error("Card placement error: Used cards not found in player hand.");
//     }
// }