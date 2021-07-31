import { makeStyles } from "@material-ui/core";
import React from "react";
import { IBirdCard } from "../types";

interface GameCardProps {
    CardData: IBirdCard
    draggable?: boolean
}

const useStyles = makeStyles({
    GameCard: {
        height: 210,
        width: 150,
        borderRadius: 15,
        display: "grid",
        backgroundSize: "contain",
        placeItems: "center",
    }
})

const GameCard = (props: GameCardProps) => {

    const classes = useStyles();

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer.setData("text/json", JSON.stringify(props.CardData))
        console.log(e.dataTransfer)
    }


    return (
        <div className={classes.GameCard} style={{backgroundImage: 'url(' + props.CardData.imageFile + ')'}} draggable={props.draggable} onDragStart={handleDragStart}>
        </div>
    )
}

export default GameCard;