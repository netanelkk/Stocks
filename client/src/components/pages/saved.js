import React, { useState, useEffect, useRef } from 'react'
import { StockWidget } from '../stock/widget';
import { mysaved, reorder } from '../../api';
import { Sort } from './sort';


function Saved(props) {
    const { topRef } = props;
    const [data, setData] = useState(null);
    const pageRef = useRef();

    useEffect(() => {
        topRef.current.scrollTop = 0;
        (async () => {
            const d = await mysaved("");
            if (!d.pass) return;
            setData(d.data);
            for (let i = 0; i < d.data.length; i++) {
                Sort.stockmap.push(d.data[i].id);
            }
            Sort.initarr(d.data.length);
            Sort.reorder = reorder;
        })();
    }, []);

    return (
        <>
            <div className="stocks-title">
                <h2>Saved Stocks</h2>
            </div>
            <div className='row dragrow' id="dragparent" onDragOver={e => { e.preventDefault(); }}>

                {data && data.map((stock, i) => (<StockWidget stock={stock} key={"stock" + stock.id}
                                                              Sort={Sort} i={i} />))}
            </div>
        </>
    );
}

export default Saved;
