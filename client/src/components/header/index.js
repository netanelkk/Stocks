import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom";

function Header() {
    return (
        <div className="header">
            <Link to={window.PATH}>
                <div className="logo">
                    <i className="bi bi-graph-up"></i> Stocks
                </div>
            </Link>
            <div className="search">
                <input type="text" placeholder="Search for stock.." />
                <button><i className="bi bi-search"></i></button>
            </div>
            <div className="userheader">
                <img src="https://cdn4.buysellads.net/uu/1/127419/1670532337-Stock2.jpg" />
                <i className="bi bi-chevron-down"></i>
            </div>
        </div>
    );
}

export default Header;
