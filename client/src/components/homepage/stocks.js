import React, { useState, useEffect, useRef } from 'react'
import { StockWidget } from '../stock/widget';
import { fetchAll } from '../../api';

function Stocks() {
    const [homeStocks, setHomeStocks] = useState(null);

    useEffect(() => {
        (async () => {
            const d = await fetchAll();
            if (!d.pass) return;
            setHomeStocks(d.data);
        })();
    }, []);

    return (
        <>
            <div className="row">
                {homeStocks &&
                    homeStocks.map(stock => (<StockWidget stock={stock} key={"stock" + stock.id} />))}
            </div>
        </>
    );
}

export default Stocks;
