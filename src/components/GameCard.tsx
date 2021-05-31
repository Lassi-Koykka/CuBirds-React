import React from "react";

interface GameCardProps {
    GameCardData: IGameCard
}

export interface IGameCard {
    title: string,
    description?: string,
    frontImageUrl?: string,
    backImageUrl?: string 
}

const GameCard = (props: GameCardProps) => {

    const gameCardStyles = {
        height: "350px",
        width: "250px",
        borderRadius: "15px",
        background: "white",
        color: "black",
        display: "grid",
        placeItems: "center",      
    }

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer.setData("text/json", JSON.stringify(props.GameCardData))
        console.log(e.dataTransfer)
    }

    return(
        <div style={gameCardStyles} draggable onDragStart={handleDragStart}>
            {<h1>{props.GameCardData.title}</h1>}
            {props.GameCardData.description ? <p style={{maxWidth: "80%"}}>{props.GameCardData.description}</p> : <></>}
        </div>
    )
}

export default GameCard;