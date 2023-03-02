import React, {useEffect,useState} from 'react'
import { Link, useLocation } from "react-router-dom";

function Menu() {
    const location = useLocation();
    const path = window.location.pathname.replace(window.PATH,'').split("/")[1];
    const [pathChange, setPathChange] = useState(0);

    const updateActive = () => { 
      setPathChange(pathChange+1); 
    }

    useEffect(() => {
        updateActive();
    }, [location]);


    return (
        <div className="menu">
            <ul>
                <Link to={window.PATH + "/"}>
                    <li className={(path==="") ? "active" : ""}>
                        <i className="bi bi-house"></i>
                        <div>HOME</div>
                    </li>
                </Link>
                <Link to={window.PATH + "/top"}>
                <li className={(path==="top") ? "active" : ""}>
                    <i className="bi bi-gem"></i>
                    <div>TOP</div>
                </li>
                </Link>
                <Link to={window.PATH + "/saved"}>
                <li className={(path==="saved") ? "active" : ""}>
                    <i className="bi bi-bookmark"></i>
                    <div>SAVED</div>
                </li>
                </Link>
                <Link to={window.PATH + "/analyse"}>
                <li className={(path==="analyse") ? "active" : ""}>
                    <i className="bi bi-clipboard-data"></i>
                    <div>ANALYSE</div>
                </li>
                </Link>
            </ul>
        </div>
    );
}

export default Menu;
