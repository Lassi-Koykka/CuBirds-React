import { createStyles, makeStyles, Slide, Theme } from "@material-ui/core";
import React from "react";
import { ICard } from "../types";
import "../Animation.css"

interface GameCardProps {
    CardData: ICard,
    flockCard?: boolean,
    gonnaMove?: boolean,
    draggable?: boolean,
    selected?: boolean,
    onClick?: () => void,
    direction?: "up" | "down" | "left" | "right" | undefined
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    GameCard: {
        animationName: "appear",
        animationDuration: "500ms",
        height: 168,
        width: 120,
        borderRadius: 15,
        display: "grid",
        backgroundSize: "contain",
        placeItems: "center",
        [theme.breakpoints.down("md")]: {
            width: 80,
            height: 112
        },
        [theme.breakpoints.down("xs")]: {
            width: 60,
            height: 84
        }
    },
    GameCardMoving: {
        animationName: "disappear",
        animationDuration: "800ms",
        height: 168,
        width: 120,
        borderRadius: 15,
        display: "grid",
        backgroundSize: "contain",
        [theme.breakpoints.down("md")]: {

            width: 80,
            height: 112
        },
        [theme.breakpoints.down("xs")]: {
            width: 60,
            height: 84
        }
    }
}));

const GameCard = (props: GameCardProps) => {

    const classes = useStyles();

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer.setData("text/json", JSON.stringify(props.CardData))
        console.log(e.dataTransfer)
    }

    return (
        <Slide in={props.gonnaMove ? false : true} direction={props.direction} timeout={{ appear: 500, enter: 500, exit: 750 }} mountOnEnter unmountOnExit>
            <div style={{ 
                backgroundImage: 'url(' + props.CardData.imageFile + ')', 
                outline: props.selected ? "3px gold solid" : "none",
                ...(props.flockCard ? {width: 60, height: 84, borderRadius: 10} : {})
            }} 
            className={props.gonnaMove ? classes.GameCardMoving : classes.GameCard} 
            draggable={props.draggable} 
            onDragStart={handleDragStart} 
            onClick={props.onClick}>
            </div>
        </Slide>
    )
}

export default GameCard;