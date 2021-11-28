import { IGameState, IMove } from "./types";

export const AIPutMove = (gameState: IGameState) => {
    const {actors, gameBoard  } = gameState
    const ai = actors.find(a => a.id === gameState.currActorID)!

    const randomMove: IMove = {
        playerID: ai.id,
        usedCard: ai.hand[Math.floor(Math.random() * ai.hand.length)],
        row: Math.floor(Math.random() * gameBoard.length),
        side: Math.random() < 0.5 ? "left" : "right"
    }
    
    return randomMove

    // Two ways to win: 7 different species or 3 of two different species
    
    // Make a priority queue of possible moves:


    // Which Birds to prioritize
    // -------------------------

    // 1st Priority:
    //  Birds already in player's flock (less than 3) 
    // 2nd Priority:
    //  Birds not yet in flock
    // 3rd Priority:
    //  Moves that don't get the player any cards from the table



    // Further prioritization:
    // -------------------------

    // 1st Priority:
    //  Gaining enough cards to allow sending a flock home
    // 2nd Priority, 3rd priority, 4th priority...:
    //  How many cards still needed to send a flock home 


    // Cards the player requires more desirable?

    // --> execute most desirable move
}