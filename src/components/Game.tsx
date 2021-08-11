import {useContext, useEffect, useState} from "react"
import { ActionType } from "../Actions";
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
    const {moveData, setMoveData} = useContext(MoveDataContext);

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

    const PlayerFlock = async () => {

        // If no player can't send any flocks home
        GetPossibleFlocks(state.actors[0].hand).length < 1 && dispatch({ type: ActionType.NextPhase })

        setMoveData(undefined);
    }


    // GameLoop
    useEffect(() => {
        console.log(state.phase)
        if (state.currActorID === 0 && moveData !== undefined) {

            if (state.phase === "Get") {
                PlayerGet();
            } else if (state.phase === "Fill") {
                Fill();
            } else if (state.phase === "Flock") {
                PlayerFlock();
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
                open={state.currActorID === 0 && state.phase === "Flock" && GetPossibleFlocks(state.actors[0].hand).length > 0 } 
                handleClose={() => {dispatch({type: ActionType.NextPhase})}} />
        </>
    )
}

export default Game;