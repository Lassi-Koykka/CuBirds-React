import { makeStyles, Slide } from "@material-ui/core";
import React from "react";
import { ICard } from "../types";

interface GameCardProps {
    CardData: ICard,
    draggable?: boolean,
    newCard?: boolean,
    direction?: "up" | "down" | "left" | "right" | undefined 
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
        <Slide in={true} direction={props.direction} timeout={props.newCard ? 500 : undefined} mountOnEnter unmountOnExit>
            <div className={classes.GameCard} style={{backgroundImage: 'url(' + props.CardData.imageFile + ')'}} draggable={props.draggable} onDragStart={handleDragStart}>
            </div>
        </Slide>
    )
}

export default GameCard;