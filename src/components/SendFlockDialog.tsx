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

    const addFlock = () => {
        setSelectedFlock(undefined);
        dispatch({type: ActionType.AddFlock, payload: {playerID: 0, birdName: selectedFlock!.species, size: selectedFlock!.size}})
    };

    const closeDialog = () => {
        setSelectedFlock(undefined);
        props.handleClose();
    }

    return (
        <Dialog open={props.open} fullWidth maxWidth="xs" PaperProps={{
            style: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
            },
          }}>
            <DialogTitle>
                You can send a flock of birds home.
            </DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1"><em>Select a flock of birds you want to send home:</em></Typography>
                <Grid container direction="row" justify="center" spacing={2}>
                    {possibleFlocks.map(flock => {
                        const card = state.actors[0].hand.find(card => card.name === flock.species)!;

                        return (
                            <Grid item>
                                <Typography variant="subtitle1" style={{fontWeight: "bold", marginTop: 10, marginBottom: 10}}>{flock.species.toUpperCase()} <br/>Size: {flock.size}</Typography>
                                <GameCard CardData={card} selected={selectedFlock ? selectedFlock.species === card.name : false} onClick={() => setSelectedFlock(possibleFlocks.find(f => f.species === card.name))} />
                            </Grid>
                        )

                    })}</Grid>
                <Grid container direction="column" style={{marginTop: 16}} alignContent="center" spacing={2}>
                    <Grid item>
                        <Button fullWidth size="large" style={{fontWeight: "bold"}} color="primary" variant="contained" disabled={selectedFlock === undefined} onClick={addFlock}>Confirm</Button>
                    </Grid>
                    <Grid item>
                        <Button fullWidth size="large" style={{fontWeight: "bold"}} color="secondary" variant="contained" onClick={closeDialog}>Don't send a flock home</Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default SendFlockDialog;