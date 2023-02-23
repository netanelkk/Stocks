import React, { useRef, useEffect, useState } from 'react'
import { Link } from "react-router-dom";

function round3digits(x) {
    return Math.round(x * 1000) / 1000;
}

export default function StockWidget(props) {
    const { stock, showoptions } = props;
    const [stockDifference, setStockDifference] = useState(stock.preprice != 0 ? round3digits(stock.price - stock.preprice) : 0);
    const [stockDifferencePercentage, setStockDifferencePercentage] = useState((stock.preprice != 0 ? round3digits(stockDifference/stock.preprice*100) : 0));

    return (
        <div className="stock-widget col-lg-3">
            <Link to={window.PATH + "/stock/" + stock.symbol}>
            <div className="stock">
                {showoptions && <div className="stock-option"><i className="bi bi-three-dots-vertical"></i></div>}
                <div className="stock-img">
                    <div>
                        <img src={window.PATH+"/images/stocks/" + stock.icon} />
                    </div>
                </div>
                <div className="stock-data">
                    <div className="stock-title">
                        <h2>{stock.name}</h2>
                        <div className={"stock-info " + ((stockDifference < 0) ? "negative" : "positive")}>
                            <span>{stockDifference}</span>
                            <span>{isNaN(stockDifferencePercentage) ? 0 : stockDifferencePercentage + "%"}</span>
                        </div>
                    </div>
                    <div className="stock-price">${(stock.price === null ? 0 : stock.price)}</div>
                </div>
            </div>
            </Link>
        </div>
    );
}

export { StockWidget };
