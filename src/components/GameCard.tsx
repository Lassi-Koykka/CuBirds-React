import React from "react";

interface GameCardProps {
    GameCardData: IGameCard
    draggable?: boolean
}

export interface IGameCard {
    title: string,
    description?: string,
    frontImage?: string,
    backImage?: string,
}

const GameCard = (props: GameCardProps) => {

    
    const gameCardStyles: React.CSSProperties = {
        height: 210,
        width: 150,
        borderRadius: 15,
        display: "grid",
        background: 'url('+ props.GameCardData.frontImage +')',
        backgroundSize: "contain",
        placeItems: "center",
    }

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer.setData("text/json", JSON.stringify(props.GameCardData))
        console.log(e.dataTransfer)
    }

    
    return(
        <div style={gameCardStyles} draggable={props.draggable} onDragStart={handleDragStart}>
        </div>
    )
}

export default GameCard;