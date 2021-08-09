import { createContext, useState, ReactNode } from "react"

export interface IMoveData {
    row: number,
    side: "left" | "right"
}

const initValues: {moveData: IMoveData, setMoveData: () => void} = {
    moveData: {row: 0, side: "left"},
    setMoveData: () => {}
}

export const MoveDataContext = createContext<{moveData: IMoveData | undefined, setMoveData: React.Dispatch<React.SetStateAction<IMoveData | undefined>>}>(initValues)

export const MoveDataProvider = (props: { children?: ReactNode}) => {
    const [moveData, setMoveData] = useState<IMoveData>();
    return (
        <MoveDataContext.Provider value={{moveData, setMoveData}}>
        {props.children}
        </MoveDataContext.Provider>
    )
}