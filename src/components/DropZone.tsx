import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core"
import { GameStateContext } from "../GameStateContext";
import { ICard } from "../types";
import { ActionType } from "../Actions";
import { delay, GetPossibleFlocks } from "../util";
import { useEffect } from "react";


interface DropZoneProps {
    side: "left" | "right",
    row: number,
}


const useStyles = makeStyles({
    DropZone: {
        height: 173,
        width: 125,
        borderRadius: "15px",
        border: "white 1px dashed",
        display: "grid",
        placeItems: "center",
        transition: "0.3s",
        "& *": {
            userSelect: "none"
        }
    }

});

const DropZone = (props: DropZoneProps) => {

    const { state, dispatch } = useContext(GameStateContext);
    const [moveData, setMoveData] = useState<{ row: number, side: "left" | "right" }>();
    const [filling, setFilling] = useState(false);


    const [dropHover, setDropHover] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        console.log(state.phase)
        if (state.activePlayerID === 0 && moveData !== undefined) {
            const GetPhase = async () => {
                await delay(1000)
                // Pickup cards from table or deck
                if (state.cardsToPickup.length < 1) {
                    //If doesn't get any cards from his move
                    if (state.players[0].hand.length < 1) {
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

            const FillPhase = async () => {
                console.log("FILL PHASE FIRED");
                while (state.gameBoard[moveData.row].every(c => c.name === state.gameBoard[moveData.row][0].name)) {
                    await delay(1000)
                    dispatch({ type: ActionType.FillRowByOne, payload: { row: moveData.row, side: moveData.side } });
                }
                dispatch({ type: ActionType.NextPhase })

            }

            const FlockPhase = async () => {
                dispatch({ type: ActionType.NextPhase })
                setMoveData(undefined);
            }



            if (state.phase === "Get") {
                GetPhase();
            } else if (state.phase === "Fill") {
                // Fill row if necessary
                FillPhase();
            } else if (state.phase === "Flock") {
                FlockPhase();
            }
        }
    }, [state.phase, dispatch, moveData]);



    const HandlePlace = async (usedCard: ICard, row: number, side: "left" | "right") => {
        setMoveData({ row, side });

        // Place the cards
        dispatch({ type: ActionType.PlaceCards, payload: { playerID: 0, usedCard, row, side } });
    }

    const handleOnDrop = (e: React.DragEvent) => {
        e.preventDefault();

        setDropHover(false)
        if (e.dataTransfer.dropEffect !== "none" && state.activePlayerID === 0 && state.phase === "Put") {
            const data = e.dataTransfer.getData("text/json");
            console.log("DATA: \n" + data);
            let card: ICard = JSON.parse(data);
            HandlePlace(card, props.row, props.side);
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setDropHover(true)
    }

    return (
        <div className={classes.DropZone}
            style={{ background: (dropHover ? (state.activePlayerID === 0 && state.phase === "Put" ? "#4CAF50" : "#F44336") : "transparent") }}
            onDragLeave={() => setDropHover(false)}
            onDragOver={handleDragOver}
            onDrop={handleOnDrop} >
        </div>
    )
}

export default DropZone;