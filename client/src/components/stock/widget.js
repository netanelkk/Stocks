import React, { useRef, useEffect, useState } from 'react'
import { Link } from "react-router-dom";


export default function StockWidget(props) {
    const { stock, showoptions, isColumn, i } = props;

    return (
        <div className={"stock-widget" + (isColumn ? "" : " col-lg-3")} draggable="true">
            <Link to={window.PATH + "/stock/" + stock.symbol}>
            <div className={"stock" + (i===0 && isColumn ? " top-stock" : "")}>
                {showoptions && <div className="stock-option"><i className="bi bi-three-dots-vertical"></i></div>}
                <div className="stock-img">
                    <div>
                        <img src={window.PATH+"/images/stocks/" + stock.icon} />
                    </div>
                </div>
                <div className="stock-data">
                    <div className="stock-title">
                        <h2>{stock.name}</h2>
                        <div className={"stock-info " + ((stock.stock_difference < 0) ? "negative" : "positive")}>
                            <span>{stock.stock_difference}</span>
                            <span>{stock.stock_difference_percentage + "%"}</span>
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
