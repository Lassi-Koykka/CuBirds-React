import React, { useContext, useState } from "react";
import {makeStyles} from "@material-ui/core"
import { GameStateContext } from "../GameStateContext";
import { ICard } from "../types";
import { ActionType } from "../Actions";
import { delay } from "../util";


interface DropZoneProps {
    side: "left"  | "right",
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

    const [dropHover, setDropHover] = useState(false);
    const classes = useStyles();

    const HandlePlayerMove = async (usedCard: ICard, row: number, side: "left" | "right") => {
        dispatch({type: ActionType.PlaceCards, payload: {playerID: 0, usedCard, row, side}});
        await delay(1000);
        dispatch({type: ActionType.PickUpCards, payload: {playerID: 0, row, cards: state.cardsToPickup}})
        await delay(1000)
        if(state.gameBoard[row].every(c => c.name === state.gameBoard[row][0].name)) {
            while(state.gameBoard[row].every(c => c.name === state.gameBoard[row][0].name)) {
                dispatch({type: ActionType.FillRowByOne, payload: {row, side}})
                await delay(1000)
            }
        }
    }

    const handleOnDrop = (e: React.DragEvent) => {
        e.preventDefault();
        
        setDropHover(false)
        if (e.dataTransfer.dropEffect !== "none" && state.activePlayerID === 0) {
            const data = e.dataTransfer.getData("text/json");
            console.log("DATA: \n" + data);
            let card: ICard = JSON.parse(data)
            HandlePlayerMove(card, props.row, props.side)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setDropHover(true)
    }

    return (
        <div className={classes.DropZone} 
        style={{background: (dropHover ? (state.activePlayerID === 0 ? "#4CAF50" : "#F44336" ) : "transparent")}} 
        onDragLeave={() => setDropHover(false)}
        onDragOver={handleDragOver}
        onDrop={handleOnDrop} >
        </div>
    )
}

export default DropZone;