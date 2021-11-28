import { useContext } from "react";
import { Grid, Typography } from "@material-ui/core";
import { GameStateContext } from "../GameStateContext";
import { CountSpecies } from "../util";
import GameCard from "./GameCard";

const GameStatusBar = () => {

    const { state } = useContext(GameStateContext)

    const playersFlocks = state.actors.map(a => ({ player: a, flocks: CountSpecies(a.flocks) }));

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
            {
                playersFlocks.map(({ player, flocks }) =>
                    <>
                        <Typography variant="h6" >
                            {player.name} FLOCKS:
                        </Typography>
                        <Grid container spacing={1} style={{ width: 320 }} direction="row-reverse" >
                            {Object.keys(flocks).map((speciesName) => {
                                const cardData = player.flocks.find(c => c.name === speciesName)!
                                return (
                                    <Grid item xs={3}>
                                        <Typography variant="subtitle1" align="center">
                                            {speciesName[0].toLocaleUpperCase() + speciesName.slice(1)}
                                        </Typography>
                                        <div style={{ position: "relative", width: "min-content", margin: "auto" }}>
                                            <div style={{ filter: "brightness(50%)" }}>
                                                <GameCard CardData={cardData} flockCard direction="up" />
                                            </div>
                                            <Typography variant="h4" style={{ color: "white", position: "absolute", top: "25%", left: "30%" }}>{flocks[speciesName]}</Typography>
                                        </div>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </>
                )
            }
        </div>

    </>
    );
}

export default GameStatusBar;