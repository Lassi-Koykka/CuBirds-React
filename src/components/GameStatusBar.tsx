import { useContext } from "react";
import { Typography } from "@material-ui/core";
import { GameStateContext } from "../GameStateContext";

const GameStatusBar = () => {

    const { gameState } = useContext(GameStateContext)

    return (
        <div style={{ position: "fixed", top: 20, left: 20 }}>
            <Typography variant="h5" >
                {gameState.statusText}
            </Typography>
        </div>
    );
}

export default GameStatusBar;