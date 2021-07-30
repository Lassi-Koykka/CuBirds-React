import { useState, useContext } from "react"
import { Grid } from "@material-ui/core"
import { IGameCard } from "./GameCard"
import DropZone from "./DropZone";
import { GameStateContext } from "../GameStateContext"
import { toGameCard } from "../util";


const GameBoard = () => {

    const { gameState, setGameState } = useContext(GameStateContext)

    console.log(gameState);

    return (
        <Grid container direction="column" spacing={1} style={{ width: "100vw", height: "100vh" }}>

            {
                gameState.gameBoard.map(row => {
                    return (
                        <Grid item container direction="row" justify="center" wrap="nowrap">
                            <Grid item><DropZone /></Grid>
                                {row.map(card => <Grid item><DropZone cardData={toGameCard(card)}/></Grid>)}
                            <Grid item><DropZone /></Grid>
                        </Grid>
                    )
                })
            }


        </Grid>

    )
}

export default GameBoard