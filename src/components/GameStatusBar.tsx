import { useContext } from "react";
import { Typography } from "@material-ui/core";
import { GameStateContext } from "../GameStateContext";

const GameStatusBar = () => {

    const { state } = useContext(GameStateContext)

    return (
        <div style={{ position: "fixed", top: 20, left: 20, textAlign: "left" }}>
            <Typography variant="h5" >
                {state.players.find(p => p.id === state.activePlayerID)?.name} TURN
            </Typography>
            <Typography variant="h6" >
                {state.statusText}
            </Typography>
        </div>
    );
}

export default GameStatusBar;