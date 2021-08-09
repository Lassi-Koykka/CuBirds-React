import { ActionType, GameActions } from "./Actions";
import cards from "./cards.json"
import { ICard, IGameBoard, IGameState, IActor } from "./types"
import { CountSpecies } from "./util";



export const GameReducer = (state: IGameState, action: GameActions): IGameState => {
    switch (action.type) {
        case ActionType.AddPlayer:
            return { ...state, actors: [action.payload, ...state.actors] }
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
        case ActionType.DrawFromDeck:
            return DrawFromDeck(action.payload.playerID, state)
        case ActionType.FillRowByOne:
            return FillRowByOne(action.payload.row, action.payload.side, state);
        case ActionType.SetMovingCards:
            return { ...state, cardsToPickup: action.payload.cards }
        case ActionType.SetStatusText:
            return { ...state, statusText: action.payload }
        case ActionType.NextPhase:
            return { ...state, phase: GetNextPhase(state.phase) }
        case ActionType.NextTurn:
            // current (player id + 1) % amount of players = next player id
            return { ...state, currActorID: (state.currActorID + 1) % state.actors.length }
        default:
            return state;

    }
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
    const players: IActor[] = [
        {
            id: 0,
            name: "PLAYER",
            isClient: true,
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

    return {
        currActorID: 0,
        deck,
        gameBoard,
        cardsToPickup: [],
        discardPile,
        actors: players,
        statusText: "",
        phase: "Put"
    }
}

export const GetNextPhase = (phase: "Put" | "Get" | "Fill" | "Flock"): "Put" | "Get" | "Fill" | "Flock" => {
    switch (phase) {
        case "Put":
            return "Get"
        case "Get":
            return "Fill"
        case "Fill":
            return "Flock"
        default:
            return "Put"
    }
}

export const PlaceCards = (playerID: number, usedCard: ICard, row: number, side: "left" | "right", gameState: IGameState): IGameState => {
    let { actors: players, gameBoard } = gameState
    let { hand } = players.find(p => p.id === playerID)!;

    //  PLACE CARDS FROM HAND TO THE TABLE

    const usedCards = hand.filter(card => card.name === usedCard.name)
    const currRow = gameBoard[row]

    const receivedCards = getCardsFromRow(side, usedCard.name, [...currRow]);
    // Add cards to the appropriate side of the row

    if (side === "left") {
        currRow.unshift(...usedCards);
    } else {
        currRow.push(...usedCards);
    }

    console.log(currRow.map(c => c.name));

    // Remove card from players hand
    hand = hand.filter(card => !usedCards.includes(card))

    return {
        ...gameState,
        phase: "Get",
        gameBoard,
        cardsToPickup: receivedCards,
        actors: players.map(p => p.id === playerID ? { ...p, hand: hand } : p)
    }
}

export const PickUpCards = (playerID: number, row: number, state: IGameState): IGameState => {

    let { actors: players, gameBoard, deck, discardPile } = state
    let { hand } = players.find(p => p.id === playerID)!;

    gameBoard[row] = gameBoard[row]
        .filter(rowCard =>
            state.cardsToPickup.every(
                receivedCard => receivedCard.uid !== rowCard.uid
            ))

    hand.push(...state.cardsToPickup);

    hand.sort((a, b) => a.name > b.name ? 1 : -1);

    const cardCounts = CountSpecies(state.cardsToPickup)

    const statusText = "Received: " + Object.keys(cardCounts).map(key => cardCounts[key] + "x " + key + " ");

    return {
        ...state,
        phase: "Fill",
        statusText,
        cardsToPickup: [],
        deck,
        discardPile,
        gameBoard,
        actors: players.map(p => p.id === playerID ? { ...p, hand: hand } : p)
    }
}

const DrawFromDeck = (playerID: number, state: IGameState): IGameState => {
    let { deck, discardPile, actors: players } = state;
    let { hand } = players.find(p => p.id === playerID)!;

    let card1, card2;

    if (deck.length > 2) {
        card1 = deck.pop()!
        card2 = deck.pop()!
        hand.push(card1)
        hand.push(card2)
    } else {
        deck = Shuffle(discardPile)
        discardPile = []

        card1 = deck.pop()!
        card2 = deck.pop()!
        hand.push(card1)
        hand.push(card2)
    }

    hand.sort((a, b) => a.name > b.name ? 1 : -1);

    let statusText = "Drew 2 cards from the deck";

    return {
        ...state,
        phase: "Fill",
        deck,
        discardPile,
        statusText,
        actors: players.map(p => p.id === playerID ? { ...p, hand: hand } : p)
    }
}

const FillRowByOne = (row: number, side: "left" | "right", state: IGameState): IGameState => {
    let { deck, gameBoard, discardPile } = state;
    if (deck.length < 1) {
        deck = Shuffle(discardPile)
        discardPile = []
    }
    const newCard = deck.pop()!;
    side === "left" ? gameBoard[row].push(newCard) : gameBoard[row].unshift(newCard)

    const statusText = "Added a new card to row " + (row + 1);

    return { ...state, statusText, deck, gameBoard };
}

const getCardsFromRow = (side: "left" | "right", cardName: string, row: ICard[]) => {
    let receivedCards: ICard[] = [];

    side === "left" ?
        receivedCards = row.splice(0, row.findIndex(card => card.name === cardName))
        : receivedCards = row.reverse().splice(0, row.findIndex(card => card.name === cardName)).reverse()

    return receivedCards;
}
