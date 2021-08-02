import { makeStyles, Grid } from "@material-ui/core";
import { useContext } from "react";
import { GameStateContext } from "../GameStateContext";
import GameCard from "./GameCard";
//import DropZone from "./DropZone";

const useStyles = makeStyles({
    PlayerHand: { 
        position: "fixed", 
        bottom: 0, 
        left: 0, 
        width: "100%", 
        height: "auto", 
        background: "transparent" 
    },
    RowCard: {
        transition: "0.3s",
        "&:hover": {
            transition: "0.3s",
            margin: "0",
            transform: "translateY(-40px)"
          }
    }
})

const PlayerHand = () => {

    const classes = useStyles();

    const { gameState } = useContext(GameStateContext)

    let zIndex = 1000;

    console.log(gameState.playerHand);

    return (
        <Grid container className={classes.PlayerHand} direction="row" justify="center" wrap="nowrap">
            {gameState.playerHand.map((card) => {
                let z = zIndex;
                zIndex -= 1;
                return (
                    <Grid item key={card.uid} className={classes.RowCard} style={{zIndex: z, margin: `0 -${gameState.playerHand.length* 1.5}px`,}}>
                        <GameCard direction="up" newCard={gameState.cardsMoved.some((movedCard) => movedCard.uid === card.uid)} CardData={card} draggable/>
                    </Grid>
                )
            })}
        </Grid>
    )
}

export default PlayerHand;