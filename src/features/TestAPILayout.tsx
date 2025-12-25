import {Outlet} from "react-router-dom";

export default function TestAPILayout(){
    return(
        <div>
            <div className={'container m-auto'}>
                <Outlet/>
            </div>
        </div>

    )
}