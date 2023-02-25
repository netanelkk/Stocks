import React, { useState, useEffect, useRef } from 'react'
import { StockWidget } from '../stock/widget';
import { fetchHome, fetchArticles } from '../../api';
import Async from "react-async";
import { Link } from "react-router-dom";


function Saved() {
    return (
        <>
                <button className="page-button">+ Add Stock</button>
            <div style={{ clear: "both" }}></div>
        </>
    );
}

export default Saved;
