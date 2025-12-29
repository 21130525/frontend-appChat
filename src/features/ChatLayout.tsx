import {Outlet} from "react-router-dom";
import {useAppSelector} from "../app/hooks.ts";

export default function ChatLayout(){
    const user = useAppSelector((state) => state.auth.user)
    return(
        <div>
            {user}
            <div className={'container m-auto'}>
                <Outlet/>
            </div>
        </div>

    )
}