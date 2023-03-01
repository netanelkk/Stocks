import React, { useRef, useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { removesaved, addsaved } from '../../api';

export default function StockWidget(props) {
    const { stock, isColumn, Sort, i, optionClick } = props;
    const [add, setAdd] = useState(stock.saved ? stock.saved : false);

    const menuOptionClick = async (e) => {
        e.preventDefault();  

        let d = (!add ? await addsaved(stock.id) : await removesaved(stock.id));
        if(d.pass) {
            optionClick();
            setAdd(val => !val);
        }else{
            alert("error");
        }
    }

    return (
        <div className={"stock-widget" + (isColumn ? "" : " col-lg-3")} id={"drag" + i}>
            <Link to={window.PATH + "/stock/" + stock.symbol} draggable="false">
                <div className={"stock" + (i === 0 && isColumn ? " top-stock" : "")} draggable="true" id={"widget" + i}
                    onDragStart={() => { if (Sort) { Sort.dragstart(i) } }}
                    onDragEnter={() => { if (Sort) { Sort.dragenter() } }}
                    onDragOver={e => ((Sort && Sort.dragover(e, i)))}
                    onDragEnd={() => { if (Sort) { Sort.dragend() } }}>

                    {stock.saved !== undefined &&
                        <div className="stock-option" onClick={e => menuOptionClick(e) }>
                            {!add ? <i className="bi bi-bookmark"></i> : <i className="bi bi-bookmark-fill"></i>}
                        </div>
                    }

                    <div className="stock-img">
                        <div>
                            <img src={window.PATH + "/images/stocks/" + stock.icon} />
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
