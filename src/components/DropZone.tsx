import React, { useContext, useState } from "react";
import {makeStyles} from "@material-ui/core"
import { GameStateContext } from "../GameStateContext";
import { PlaceCards } from "../util";
import { ICard } from "../types";


interface DropZoneProps {
    side: "left"  | "right",
    row: number,
}


const useStyles = makeStyles({
    DropZone: {
        height: 220,
        width: 160,
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

    const { gameState, setGameState } = useContext(GameStateContext);

    const [dropHover, setDropHover] = useState(false);
    const classes = useStyles();

    const handleOnDrop = (e: React.DragEvent) => {
        e.preventDefault();
        
        setDropHover(false)
        if (e.dataTransfer.dropEffect !== "none") {
            const data = e.dataTransfer.getData("text/json");
            console.log("DATA: \n" + data);
            let card: ICard = JSON.parse(data)
            // console.log(data);
            setGameState(PlaceCards(gameState, card, props.row, props.side))
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setDropHover(true)
    }

    return (
        <div className={classes.DropZone} style={{background: (dropHover ? "#4CAF50" : "transparent")}} 
        onDragLeave={() => setDropHover(false)}
        onDragOver={handleDragOver}
        onDrop={handleOnDrop} >
        </div>
    )
}

export default DropZone;