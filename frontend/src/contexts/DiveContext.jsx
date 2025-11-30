/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer } from 'react';

export const DiveContext = createContext();

export const diveReducer = (state, action) => {
    switch (action.type) {
        case 'SET_DIVES':
            return { ...state, dives: action.payload };

        case 'CREATE_DIVE':
            return { ...state, dives: [action.payload, ...(state.dives || [])] };

        case 'DELETE_DIVE':
            return { 
                ...state, 
                dives: (state.dives || []).filter(dive => dive._id !== action.payload._id)
            };

        case 'UPDATE_DIVE':
            return {
                ...state,
                dives: (state.dives || []).map(dive =>
                    dive._id === action.payload._id ? action.payload : dive
                )
            };

        default:
            return state;
    }
};

export const DiveContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(diveReducer, { dives: [] });

    return (
        <DiveContext.Provider value={{ ...state, dispatch }}>
            {children}
        </DiveContext.Provider>
    );
};

