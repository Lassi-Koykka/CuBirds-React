import React, { useContext, useState } from "react";
import {makeStyles} from "@material-ui/core"
import { GameStateContext } from "../GameStateContext";
import { ICard } from "../types";


interface DropZoneProps {
    cardData?: ICard,
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

    const { state, dispatch } = useContext(GameStateContext);

    const [card, setCard] = useState(props.cardData);
    const [dragging, setDragging] = useState(false);
    const [dropHover, setDropHover] = useState(false);
    const classes = useStyles();

    const handleOnDrop = (e: React.DragEvent) => {
        e.preventDefault();
        
        setDropHover(false)
        if (e.dataTransfer.dropEffect !== "none") {
            const data = e.dataTransfer.getData("text/json");
            console.log("DATA: \n" + data);
            let card: ICard = JSON.parse(data)
            setCard(card)
            //setGameState(PlaceCards(gameState, card, props.row, props.side))
        }
    }

    const handleDragEnd = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        setDropHover(false)

        if (e.dataTransfer.dropEffect === "move") {
            setCard(undefined);
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        if (!dragging && card === undefined) {
            e.preventDefault()
            setDropHover(true)
        }
    }

    return (
        <div className={classes.DropZone} style={{background: (dropHover ? "#4CAF50" : "transparent")}} 
        onDragStart={() => setDragging(true)} 
        onDragLeave={() => setDropHover(false)}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDrop={handleOnDrop} >
            <h3>DropZone</h3>
        </div>
    )
}

export default DropZone;