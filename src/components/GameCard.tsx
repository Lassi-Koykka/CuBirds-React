import { makeStyles, Slide } from "@material-ui/core";
import React from "react";
import { ICard } from "../types";
import "../Animation.css"

interface GameCardProps {
    CardData: ICard,
    gonnaMove?: boolean,
    draggable?: boolean,
    direction?: "up" | "down" | "left" | "right" | undefined
}

const useStyles = makeStyles({
    GameCard: {
        animationName: "appear",
        animationDuration: "500ms",
        height: 168,
        width: 120,
        borderRadius: 15,
        display: "grid",
        backgroundSize: "contain",
        placeItems: "center",
    },
    GameCardMoving: {
        animationName: "disappear",
        animationDuration: "800ms",
        height: 210,
        width: 150,
        borderRadius: 15,
        display: "grid",
        backgroundSize: "contain",
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
        <Slide in={props.gonnaMove ? false : true} direction={props.direction} timeout={{ appear: 500, enter: 500, exit: 750 }} mountOnEnter unmountOnExit>
            <div style={{ backgroundImage: 'url(' + props.CardData.imageFile + ')'}} className={props.gonnaMove ? classes.GameCardMoving : classes.GameCard} 
            draggable={props.draggable} onDragStart={handleDragStart}>
            </div>
        </Slide>
    )
}

export default GameCard;