import React from 'react'
import { Link } from "react-router-dom";

function Menu() {
    return (
        <div className="menu">
            <ul>
            <Link to={window.PATH + "/"}>
                <li className="active">
                    <i className="bi bi-house"></i>
                    <div>HOME</div>
                </li>
                </Link>
                <li>
                    <i className="bi bi-gem"></i>
                    <div>TOP</div>
                </li>
                <li>
                    <i className="bi bi-bookmark"></i>
                    <div>SAVED</div>
                </li>
                <li>
                    <i className="bi bi-clipboard-data"></i>
                    <div>STATISTICS</div>
                </li>
            </ul>
        </div>
    );
}

export default Menu;
