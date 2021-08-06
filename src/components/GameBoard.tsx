import { useContext } from "react"
import { Grid } from "@material-ui/core"
import DropZone from "./DropZone";
import { GameStateContext } from "../GameStateContext"
import GameCard from "./GameCard";


const GameBoard = () => {

    const { state } = useContext(GameStateContext)
    let rowIndex = 0;

    console.log(state);

    return (
        <Grid container direction="column" wrap="nowrap" spacing={1} style={{ width: "100vw", height: "100vh" }}>

            {
                state.gameBoard.map(row => {
                    let currRow = rowIndex;
                    rowIndex += 1;
                    return (
                        <Grid key={"row" + currRow} item container direction="row" spacing={1} justify="center" alignItems="center" wrap="nowrap">
                            <Grid item><DropZone row={currRow} side="left" /></Grid>
                            {row.map(card =>
                                <Grid key={card.uid} item>
                                    <GameCard CardData={card} direction="up" gonnaMove={state.cardsToPickup.some((c) => c.uid === card.uid)} />
                                </Grid>
                            )}
                            <Grid item><DropZone row={currRow} side="right" /></Grid>
                        </Grid>
                    )
                })
            }


        </Grid>

    )
}

export default GameBoard