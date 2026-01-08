import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import useInterval from "../../../app/useInterval.ts";
import { resetReceivePrestates, setEndTask, setNameToCheckOnline, setWaiting } from "../reciveResponsSlice.ts";
import UserService from "../../../services/UserService.ts";
import type {User} from "./UserSlice.ts";

const UserOnlineChecker = () => {
    const dispatch = useAppDispatch();
    const users = useAppSelector((state) => state.listUser);
    const isWaiting = useAppSelector((state) => state.checkUserOnline.isWaiting);
    const checkOnLineQueue = useRef<User[]>([]);

    const processCheckOnLineQueue = () => {
        if (checkOnLineQueue.current.length > 0 && !isWaiting) {
            const user = checkOnLineQueue.current[0];
            dispatch(setNameToCheckOnline(user.name));
            dispatch(setWaiting());
            UserService.checkUserOnline(user.name);
            checkOnLineQueue.current = checkOnLineQueue.current.slice(1);
        }
        if (checkOnLineQueue.current.length === 0) {
            dispatch(setEndTask());
        }
    };

    const handleCheckUserOnline = () => {
        dispatch(resetReceivePrestates());
        checkOnLineQueue.current = users.filter(u => u.type === 0);
        processCheckOnLineQueue();
    };

    useEffect(() => {
        handleCheckUserOnline();
    }, []);

    useInterval(handleCheckUserOnline, 30000);

    useEffect(() => {
        if (!isWaiting) {
            processCheckOnLineQueue();
        }
    }, [isWaiting]);

    return null;
};

export default UserOnlineChecker;