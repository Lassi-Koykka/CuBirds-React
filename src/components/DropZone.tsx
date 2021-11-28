import React, { useContext, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core"
import { GameStateContext } from "../GameStateContext";
import { ICard } from "../types";
import { ActionType } from "../Actions";
import { MoveDataContext } from "../MoveDataContext";


interface DropZoneProps {
    side: "left" | "right",
    row: number,
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
        },
        [theme.breakpoints.down("md")]: {
            width: 85,
            height: 117
        },
        [theme.breakpoints.down("xs")]: {
            width: 60,
            height: 84
        }
    }

}));

const DropZone = (props: DropZoneProps) => {

    const { state, dispatch } = useContext(GameStateContext);
    const { setMoveData } = useContext(MoveDataContext);
    
    
    const [dropHover, setDropHover] = useState(false);
    const classes = useStyles();


    const HandlePlace = async (usedCard: ICard, row: number, side: "left" | "right") => {
        setMoveData({ row, side });

        // Place the cards
        dispatch({ type: ActionType.PlaceCards, payload: { playerID: 0, usedCard, row, side } });
    }

    const handleOnDrop = (e: React.DragEvent) => {
        e.preventDefault();

        setDropHover(false)
        if (e.dataTransfer.dropEffect !== "none" && state.currActorID === 0 && state.phase === "Put") {
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
            style={{ background: (dropHover ? (state.currActorID === 0 && state.phase === "Put" ? "#4CAF50" : "#F44336") : "transparent") }}
            onDragLeave={() => setDropHover(false)}
            onDragOver={handleDragOver}
            onDrop={handleOnDrop} >
        </div>
    )
}

export default DropZone;