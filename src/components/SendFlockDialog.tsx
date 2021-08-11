import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";
import { useContext, useState } from "react";
import { ActionType } from "../Actions";
import { GameStateContext } from "../GameStateContext";
import { GetPossibleFlocks } from "../util";
import GameCard from "./GameCard";

const SendFlockDialog = (props: { open: boolean, handleClose: () => void }) => {

    const { state, dispatch } = useContext(GameStateContext);

    const [selectedFlock, setSelectedFlock] = useState<{ species: string, size: "small" | "large" }>();

    const possibleFlocks = GetPossibleFlocks(state.actors[0].hand);

    const addFlock = () => dispatch({type: ActionType.AddFlock, payload: {playerID: 0, birdName: selectedFlock!.species, size: selectedFlock!.size}});

    const closeDialog = () => {
        setSelectedFlock(undefined);
        props.handleClose();
    }

    return (
        <Dialog open={props.open} fullWidth maxWidth="xs">
            <DialogTitle>
                You can send a flock of birds home.
            </DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1">Select a flock of birds you want to send home:</Typography>
                <Grid container direction="row" justify="center" spacing={2}>
                    {possibleFlocks.map(flock => {
                        const card = state.actors[0].hand.find(card => card.name === flock.species)!;

                        return (
                            <Grid item>
                                <Typography variant="subtitle2" style={{marginTop: 10}}>{flock.species.toUpperCase()}</Typography>
                                <Typography variant="subtitle2" style={{marginBottom: 10}}>Size: {flock.size}</Typography>
                                <GameCard CardData={card} selected={selectedFlock ? selectedFlock.species === card.name : false} onClick={() => setSelectedFlock(possibleFlocks.find(f => f.species === card.name))} />
                            </Grid>
                        )

                    })}</Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>Don't send a flock home</Button>
                <Button disabled={selectedFlock === undefined} onClick={addFlock}>Confirm</Button>
            </DialogActions>
        </Dialog>
    )
}

export default SendFlockDialog;