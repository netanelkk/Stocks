import React, { useState, useEffect, useRef } from 'react'
import { StockWidget } from '../stock/widget';
import { fetchAll } from '../../api';

function Top(props) {
    const { topRef } = props;
    const [topPercentage, setTopPercentage] = useState(null);
    const [lowPercentage, setLowPercentage] = useState(null);

    const [topDifference, setTopDifference] = useState(null);
    const [lowDifference, setLowDifference] = useState(null);

    useEffect(() => {
        topRef.current.scrollTop = 0;
        (async () => {
            const d = await fetchAll("");
            if (!d.pass) throw new Error(d.msg);
            let data = d.data;
            data.sort((a, b) => { return a.stock_difference_percentage < b.stock_difference_percentage });
            setTopPercentage(data.slice(0, 5));

            data.sort((a, b) => { return a.stock_difference_percentage > b.stock_difference_percentage });
            setLowPercentage(data.slice(0, 5));

            data.sort((a, b) => { return a.stock_difference < b.stock_difference });
            setTopDifference(data.slice(0, 5));

            data.sort((a, b) => { return a.stock_difference > b.stock_difference });
            setLowDifference(data.slice(0, 5));
        })();
    }, []);

    return (
        <>
            <div className="stocks-title">
                <h2>Daily Movers</h2>
            </div>
            <div className="top-row">
                <div className="row-column">
                    <div className="top-title">
                        <i className="bi bi-arrow-up-circle-fill"></i>
                        <div>Percentage</div>
                    </div>
                    {topPercentage && topPercentage.map((stock,i) => (<StockWidget i={i} stock={stock} key={"stock" + stock.id} isColumn={true} />))}
                    {!topPercentage && <div className='loading-large' style={{height:"400px"}}></div>}
                </div>
                <div className="row-column">
                    <div className="top-title">
                        <i className="bi bi-arrow-down-circle-fill"></i>
                        <div>Percentage</div>
                    </div>
                    {lowPercentage && lowPercentage.map((stock,i) => (<StockWidget i={i} stock={stock} key={"stock" + stock.id} isColumn={true} />))}
                    {!lowPercentage && <div className='loading-large' style={{height:"400px"}}></div>}
                </div>
            </div>

            <div className="top-row">
                <div className="row-column">
                    <div className="top-title">
                        <i className="bi bi-arrow-up-circle-fill"></i>
                        <div>Price Difference</div>
                    </div>
                    {topDifference && topDifference.map((stock,i) => (<StockWidget i={i} stock={stock} key={"stock" + stock.id} isColumn={true} />))}
                    {!topDifference && <div className='loading-large' style={{height:"400px"}}></div>}
                </div>
                <div className="row-column">
                    <div className="top-title">
                        <i className="bi bi-arrow-down-circle-fill"></i>
                        <div>Price Difference</div>
                    </div>
                    {lowDifference && lowDifference.map((stock,i) => (<StockWidget i={i} stock={stock} key={"stock" + stock.id} isColumn={true} />))}
                    {!lowDifference && <div className='loading-large' style={{height:"400px"}}></div>}
                </div>
            </div>
        </>
    );
}

export default Top;
