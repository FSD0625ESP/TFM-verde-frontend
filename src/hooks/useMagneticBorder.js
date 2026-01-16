import { useEffect, useRef } from "react";
import {
    registerCard,
    unregisterCard,
    startMagneticBorder,
} from "../utils/magneticBorder";

export function useMagneticBorder() {
    const ref = useRef(null);

    useEffect(() => {
        startMagneticBorder();
        if (ref.current) registerCard(ref.current);

        return () => {
            if (ref.current) unregisterCard(ref.current);
        };
    }, []);

    return ref;
}
