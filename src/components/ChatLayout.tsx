import {Outlet} from "react-router-dom";

export default function ChatLayout(){
    return(
        <div>
            <div className={'container m-auto'}>
                <Outlet/>
            </div>
        </div>

    )
}