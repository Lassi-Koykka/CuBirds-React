import { useContext, useEffect, useState } from "react"
import { ActionType } from "../Actions";
import { AIPutMove } from "../AI";
import { GameStateContext } from "../GameStateContext";
import { MoveDataContext } from "../MoveDataContext";
import { delay, GetPossibleFlocks } from "../util";
import GameBoard from "./GameBoard"
import GameSideBar from "./GameSideBar";
import GameStatusBar from "./GameStatusBar"
import PlayerHand from "./PlayerHand"
import SendFlockDialog from "./SendFlockDialog";

const Game = () => {

    const { state, dispatch } = useContext(GameStateContext);
    const { moveData, setMoveData } = useContext(MoveDataContext);

    const PlayerGet = async () => {
        await delay(1000)
        // Pickup cards from table or deck
        if (state.cardsToPickup.length < 1) {
            //If doesn't get any cards from his move
            if (state.actors[0].hand.length < 1) {
                // If the player is out of cards
                let answer = window.confirm("Confirm to start a new round. Otherwise you will draw two cards from the deck");
                answer
                    ? console.log("Start new round")
                    : dispatch({ type: ActionType.DrawFromDeck, payload: { playerID: 0 } });
            } else {
                dispatch({ type: ActionType.DrawFromDeck, payload: { playerID: 0 } });
            }
        } else {
            // Otherwise add the cards to his hand from the table
            dispatch({ type: ActionType.PickUpCards, payload: { playerID: 0, row: moveData!.row } })
        }
    }

    const Fill = async () => {
        // Fill row if necessary
        while (state.gameBoard[moveData!.row].every(c => c.name === state.gameBoard[moveData!.row][0].name)) {
            await delay(1000)
            dispatch({ type: ActionType.FillRowByOne, payload: { row: moveData!.row, side: moveData!.side } });
        }
        dispatch({ type: ActionType.NextPhase })

    }

    const Flock = async () => {

        const possibleFlocks = GetPossibleFlocks(state.actors.find(a => a.id === state.currActorID)!.hand);

        // If player can't send any flocks home
        if(possibleFlocks.length > 0) {
            if(state.currActorID !== 0) {
                console.log("SENDING HOME FLOCK: ", possibleFlocks[0].species, possibleFlocks[0].size)
                dispatch({type: ActionType.AddFlock, payload: {playerID: state.currActorID, birdName:possibleFlocks[0].species, size: possibleFlocks[0].size}})
            }
        } else {
            dispatch({ type: ActionType.NextTurn })
        }
        
        
        setMoveData(undefined);

    }

    // AI MOVES
    const AiPut = async () => {
        await delay(3000)
        const AiMove = AIPutMove(state);
        console.log("AI " + AiMove.playerID + " PUT:", AiMove)
        setMoveData({row: AiMove.row, side: AiMove.side})

        dispatch({type: ActionType.PlaceCards, payload: AiMove})
    }

    const AiGet = async () => {
        await delay(1000)
        // Pickup cards from table or deck
        if (state.cardsToPickup.length < 1) {
            //If doesn't get any cards from his move
            dispatch({ type: ActionType.DrawFromDeck, payload: { playerID: state.currActorID } });
            if (state.actors.find(a => a.id === state.currActorID)!.hand.length < 1) {
                // If the Ai is out of cards, 50/50 it will start a new round
                // let answer = window.confirm("Confirm to start a new round. Otherwise you will draw two cards from the deck");
                // answer
                //     ? console.log("Start new round")
                //     : dispatch({ type: ActionType.DrawFromDeck, payload: { playerID: 0 } });
            } 
            // else {
            //     dispatch({ type: ActionType.DrawFromDeck, payload: { playerID: 0 } });
            // }
        } else {
            // Otherwise add the cards to his hand from the table
            dispatch({ type: ActionType.PickUpCards, payload: { playerID: state.currActorID, row: moveData!.row } })
        }
    }

    // GameLoop
    useEffect(() => {
        console.log(state.phase)
        console.log(state.actors.find(a => a.id === state.currActorID)?.name + " hand", state.actors.find(a => a.id === state.currActorID)?.hand.map(c => c.name))
        if (moveData !== undefined || state.currActorID !== 0) {

            if (state.phase === "Put" && state.currActorID !== 0) {
                AiPut();
            } else if (state.phase === "Get" && state.currActorID === 0) {
                PlayerGet();
            } else if (state.phase === "Get") {
                AiGet();
            } else if (state.phase === "Fill") {
                Fill();
            } else if (state.phase === "Flock") {
                Flock();
            }
        }
    }, [state.phase]);

    return (
        <>
            {/* <GameSideBar /> */}
            <GameStatusBar />
            <GameBoard />
            <PlayerHand />
            <SendFlockDialog
                open={state.currActorID === 0 && state.phase === "Flock" && GetPossibleFlocks(state.actors[0].hand).length > 0}
                handleClose={() => { dispatch({ type: ActionType.NextPhase }) }} />
        </>
    )
}

export default Game;