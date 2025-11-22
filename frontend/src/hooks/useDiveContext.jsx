import { useContext } from "react";
import { DiveContext } from "../contexts/DiveContext";

export const useDiveContext = () => {
    const context = useContext(DiveContext)

    if(!context){
        throw Error('useDiveContext must be used inside a DiveContextProvider')
    }

    return context
}

