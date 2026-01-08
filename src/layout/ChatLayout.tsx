import {Outlet} from "react-router-dom";

export default function ChatLayout(){
    return(
        <div>
            <div className="vh-100 bg-white">
                <Outlet/>
            </div>
        </div>

    )
}