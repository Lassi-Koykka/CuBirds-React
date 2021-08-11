import { useContext } from "react";
import { Grid, Typography } from "@material-ui/core";
import { GameStateContext } from "../GameStateContext";
import { CountSpecies } from "../util";
import GameCard from "./GameCard";

const GameStatusBar = () => {

    const { state } = useContext(GameStateContext)

    const playerFlocks = CountSpecies(state.actors[0].flocks);

    return (<>
        <div style={{ position: "fixed", top: 20, left: 20, textAlign: "left" }}>
            <Typography variant="h5" >
                {state.actors.find(p => p.id === state.currActorID)?.name} TURN
            </Typography>
            <Typography variant="h6" >
                {state.statusText}
            </Typography>
        </div>
        <div style={{ position: "fixed", top: 20, right: 20, textAlign: "right" }}>
            <Typography variant="h6" >
                DECK: {state.deck.length} CARDS
            </Typography>
            <Typography variant="h6" >
                DISCARD: {state.discardPile.length} CARDS
            </Typography>
        </div>
        <div style={{ position: "fixed", top: "20%", right: 20, textAlign: "right", width: "max-content" }}>
            <Typography variant="h6" >
                YOUR FLOCKS:
            </Typography>
            <Grid container spacing={1}>
                {Object.keys(playerFlocks).map((speciesName) => {
                    const cardData = state.actors[0].flocks.find(c => c.name === speciesName)!
                    return (
                    <Grid item xs={6}>
                    <Typography variant="caption" >
                       {speciesName[0].toLocaleUpperCase() + speciesName.slice(1)}{playerFlocks[speciesName] > 1 ? ": X" + playerFlocks[speciesName]: ""}
                    </Typography>
                    <GameCard CardData={cardData} flockCard direction="up" />
                    </Grid>
                )
                })}
            </Grid>
        </div>
    </>
    );
}

export default GameStatusBar;