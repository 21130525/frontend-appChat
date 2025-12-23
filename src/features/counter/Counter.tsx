import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {decrement, increment} from "./CounterSlice.ts";


export function Counter(){
    const count = useAppSelector((state) => state.counter.value);
    const dispatch = useAppDispatch()

    return (
        <div className={'card'}>
            <div>value: {count}</div>
            <button onClick={() =>dispatch(increment())}>
                Increment
            </button>
            <button onClick={() =>dispatch(decrement())}>
                Decrement
            </button>

        </div>
    )
}