/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer } from "react";

export const UnitContext = createContext();

export const unitReducer = (state, action) => {
    switch (action.type) {
        case "SET_UNIT_SYSTEM":
            return { ...state, unitSystem: action.payload };
        default:
            return state;
    }
};

export const UnitContextProvider = ({ children }) => {
    // default = metric
    const [state, dispatch] = useReducer(unitReducer, { unitSystem: "metric" });

    return (
        <UnitContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UnitContext.Provider>
    );
};
