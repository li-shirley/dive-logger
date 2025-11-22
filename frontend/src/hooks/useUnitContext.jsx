import { useContext } from "react";
import { UnitContext } from "../contexts/UnitContext";

export const useUnitContext = () => {
    const context = useContext(UnitContext);

    if (!context) {
        throw Error("useUnitContext must be used inside a UnitContextProvider");
    }

    return context;
};
