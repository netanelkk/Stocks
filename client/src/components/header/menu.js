import React, { useState, useEffect, useRef } from 'react'

function Menu() {
    return (
        <div className="menu">
            <ul>
                <li className="active">
                    <i className="bi bi-house"></i>
                    <div>HOME</div>
                </li>
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
