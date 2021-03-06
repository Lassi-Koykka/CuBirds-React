import { makeStyles, Grid } from "@material-ui/core";
import { useContext } from "react";
import { GameStateContext } from "../GameStateContext";
import GameCard from "./GameCard";

const useStyles = makeStyles({
    PlayerHand: { 
        position: "absolute", 
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

    const { state } = useContext(GameStateContext)

    let zIndex = 1000;

    const playerHand = state.actors[0].hand

    const playerCanPlace = (state.currActorID === 0 && state.phase === "Put");

    return (
        <Grid container className={classes.PlayerHand} direction="row" justify="center" wrap="nowrap" style={{filter: !playerCanPlace ? "brightness(50%)": undefined, transition: "0.1s"}}>
            {playerHand.map((card) => {
                let z = zIndex;
                zIndex -= 1;
                return (
                    <Grid item key={card.uid} className={classes.RowCard} style={{zIndex: z, margin: `0 -${playerHand.length* 1.5}px`,}}>
                        <GameCard direction="up" CardData={card} draggable={playerCanPlace} />
                    </Grid>
                )
            })}
        </Grid>
    )
}

export default PlayerHand;