import { useEffect, useRef } from 'react';
import {useAppSelector} from "./hooks.ts";

type Callback = () => void;

function useInterval(callback: Callback, delay: number | null) {
    const savedCallback = useRef<Callback | null>(null);
    const endTask = useAppSelector((state) => state.checkUserOnline.endTask)

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            if (savedCallback.current) {
                savedCallback.current();
            }
        }

        if (delay !== null && endTask) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay, endTask]);
}

export default useInterval;