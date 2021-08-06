import React, { createContext, ReactNode, useReducer } from "react";
import { ActionType, GameActions } from "./Actions";
import { ICard, IGameBoard, IGameState, IPlayer } from "./types"
import cards from "./cards.json"

export const gameReducer = (state: IGameState, action: GameActions): IGameState => {
    switch (action.type) {
        case ActionType.AddPlayer:
            return { ...state, players: [action.payload, ...state.players] }
        case ActionType.SetupGame:
            return SetupGame(cards)
        case ActionType.ShuffleDeck:
            return { ...state, deck: Shuffle(state.deck) }
        case ActionType.ShuffleDeckFromDiscard:
            return { ...state, deck: Shuffle(state.discardPile), discardPile: [] }
        case ActionType.PlaceCards:
            return PlaceCards(action.payload.playerID, action.payload.usedCard, action.payload.row, action.payload.side, state);
        case ActionType.PickUpCards:
            return PickUpCards(action.payload.playerID, action.payload.row, state);
        case ActionType.FillRowByOne:
            return FillRowByOne(action.payload.row, action.payload.side, state);
        case ActionType.SetMovingCards:
            return {...state, cardsToPickup: action.payload.cards}
        case ActionType.NextTurn:
            // current (player id + 1) % amount of players = next player id
            return {...state, activePlayerID: (state.activePlayerID + 1) % state.players.length}
        default:
            return state;

    }
}

const ctxDefaultValue = {
    state: {
        deck: [] as ICard[],
        discardPile: [] as ICard[],
        cardsToPickup: [] as ICard[],
        gameBoard: [[], [], [], []] as IGameBoard,
        players: [] as IPlayer[],
        activePlayerID: 0,
        statusText: ""
    },
    dispatch: () => undefined
}

export const GameStateContext = createContext<{ state: IGameState, dispatch: React.Dispatch<GameActions> }>(ctxDefaultValue);

export const GameStateProvider = (props: { gameState: IGameState, children?: ReactNode; }) => {
    const [state, dispatch] = useReducer(gameReducer, props.gameState);

    return (
        <GameStateContext.Provider value={{ state, dispatch }}>
            {props.children}
        </GameStateContext.Provider>
    )
}


// HELPER FUNCTIONS

export const Shuffle = (allCards: ICard[]) => {
    let currentIndex = allCards.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [allCards[currentIndex], allCards[randomIndex]] = [allCards[randomIndex], allCards[currentIndex]];
    }
    return allCards;
}

export const SetupGame = (startDeck: ICard[], AICount: number = 3): IGameState => {
    const deck = Shuffle(startDeck);
    const gameBoard: IGameBoard = [[], [], [], []]
    const discardPile: ICard[] = [];
    const players: IPlayer[] = [
        {
            id: 0,
            name: "PLAYER",
            hand: [],
            flocks: []
        },
        {
            id: 1,
            name: "AI 1",
            hand: [],
            flocks: []
        },
        {
            id: 2,
            name: "AI 2",
            hand: [],
            flocks: []
        },
        {
            id: 3,
            name: "AI 3",
            hand: [],
            flocks: []
        },
    ];

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

    // Give cards, sort them and give starting flock card

    for (let i = 0; !players.every(p => p.hand.length >= 8); i++) {
        const player = players[i % players.length];
        player.hand.push(deck.pop()!)
    }

    players.forEach(p => {
        p.hand.sort((a, b) => a.name > b.name ? 1 : -1)
        p.flocks.push(deck.pop()!)
    })

    //TODO randomize starting player

    return { activePlayerID: 0, 
        deck, 
        gameBoard, 
        cardsToPickup: [], 
        discardPile, 
        players, 
        statusText: "" }
}

export const PlaceCards = (playerID: number, usedCard: ICard, row: number, side: "left" | "right", gameState: IGameState): IGameState => {
    let { players, gameBoard } = gameState
    let { hand: playerHand } = players.find(p => p.id === playerID)!;

    //  PLACE CARDS FROM HAND TO THE TABLE

    const usedCards = playerHand.filter(card => card.name === usedCard.name)
    console.log("USED CARDS")
    console.log(usedCards.map(c => c.name))
    const currRow = gameBoard[row]

    const receivedCards = getCardsFromRow(side, usedCard.name, [...currRow]);
    // Add cards to the appropriate side of the row

    if (side === "left") {
        currRow.unshift(...usedCards)
    } else {
        currRow.push(...usedCards);
    }

    console.log("AFTER ADDING TO ROW:");
    console.log(currRow.map(c => c.name));

    // Remove card from players hand
    playerHand = playerHand.filter(card => !usedCards.includes(card))

    return {
        ...gameState,
        gameBoard,
        cardsToPickup: receivedCards,
        players: players.map(p => p.id === playerID ? { ...p, hand: playerHand } : p)
    }
}

export const PickUpCards = (playerID: number, row: number, state: IGameState): IGameState => {

    let { players, gameBoard, deck, discardPile } = state
    let { hand: playerHand } = players.find(p => p.id === playerID)!;
    if (state.cardsToPickup.length > 0) {
        console.log("Before");
        console.log(gameBoard[row].map(c => c.name));
        gameBoard[row] = gameBoard[row]
            .filter(rowCard =>
                state.cardsToPickup.every(
                    receivedCard => receivedCard.uid !== rowCard.uid
                ))
        console.log("After")
        console.log(gameBoard[row].map(c => c.name));
        

        playerHand.push(...state.cardsToPickup);

    } else {
        // IF PLAYER IS OUT OF CARDS
        if (playerHand.length < 1) {
            // New cards to all players if the player so chooses
            let answer = window.confirm("Confirm to start a new round. Otherwise you will draw two cards from the deck");

            if (!answer) {

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

    playerHand.sort((a, b) => a.name > b.name ? 1 : -1);

    return {
        ...state,
        deck,
        cardsToPickup: [],
        discardPile,
        gameBoard,
        players: players.map(p => p.id === playerID ? { ...p, hand: playerHand } : p)
    }
}

const FillRowByOne = (row: number, side: "left" | "right", state: IGameState): IGameState => {
    let {deck, gameBoard, discardPile} = state;
    if (deck.length < 1) {
        deck = Shuffle(discardPile)
        discardPile = []
    }
    const newCard = deck.pop()!;
    console.log("Adding card to " + (side === "left" ? "right" : "left"))
    side === "left" ? gameBoard[row].push(newCard) : gameBoard[row].unshift(newCard)
    return {...state, deck, gameBoard};
}

const getCardsFromRow = (side: "left" | "right", cardName: string, row: ICard[]) => {
    let receivedCards: ICard[] = [];

    side === "left" ?
        receivedCards = row.splice(0, row.findIndex(card => card.name === cardName))
        : receivedCards = row.reverse().splice(0, row.findIndex(card => card.name === cardName)).reverse()

    return receivedCards;
}
