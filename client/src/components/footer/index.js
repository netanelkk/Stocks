import React, { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom";

function Footer() {
    return (
        <div className="footer">
            <div className='footer-section'>
                <div className='footer-nav'>
                    <h3>Navigation</h3>
                    <div className="nav-menu">
                        <div className="footer-logo"></div>
                        <ul>
                            <Link to={window.PATH + "/"}>
                                <li>
                                    <i className="bi bi-house"></i> 
                                    Home
                                </li>
                            </Link>
                            <Link to={window.PATH + "/stocks"}>
                                <li>
                                <i className="bi bi-list-ul"></i>
                                    All Stocks
                                </li>
                            </Link>
                            <Link to={window.PATH + "/top"}>
                                <li>
                                <i className="bi bi-gem"></i>
                                    Top
                                </li>
                            </Link>
                            <Link to={window.PATH + "/saved"}>
                                <li>
                                <i className="bi bi-bookmark"></i>
                                    Saved
                                </li>
                            </Link>
                            <Link to={window.PATH + "/analyse"}>
                                <li>
                                <i className="bi bi-clipboard-data"></i>
                                    Analyse
                                </li>
                            </Link>
                        </ul>
                        <ul>
                            <Link to={window.PATH + "/stock/AAPL"}>
                                <li>
                                    Apple
                                </li>
                            </Link>
                            <Link to={window.PATH + "/stock/META"}>
                                <li>
                                    Meta
                                </li>
                            </Link>
                            <Link to={window.PATH + "/stock/MSFT"}>
                                <li>
                                    Microsoft
                                </li>
                            </Link>
                            <Link to={window.PATH + "/stock/GOOG"}>
                                <li>
                                    Google
                                </li>
                            </Link>
                            <Link to={window.PATH + "/stock/NKE"}>
                                <li>
                                    Nike
                                </li>
                            </Link>
                        </ul>
                    </div>
                </div>
                <div className='footer-credits'>
                    <h3>Created By</h3>
                    <div className="credits">
                        <div className='credit'>
                            Netanel Kluzner
                        </div>
                        <div className='credit'>
                            Guy Gavriel Halag
                        </div>
                        <div className='credit'>
                            Adir Damari
                        </div>
                    </div>
                    <span>&#169; 2023 All Right Reserved</span>
                </div>
            </div>



        </div>
    );
}

export default Footer;
