import React, { useState, useEffect, useRef } from 'react'
import { StockWidget } from '../stock/widget';
import { fetchAll } from '../../api';
import { useParams } from "react-router-dom";
import Async from "react-async";

function Stocks(props) {
    const { topRef } = props;
    const { query } = useParams();
    const [count, setCount] = useState(0);

    useEffect(() => {
        topRef.current.scrollTop = 0;
    }, [query]);

    const getData = async () => {
        const d = await fetchAll((query) ? query : "");
        if (!d.pass) throw new Error(d.msg);
        setCount(d.data.length);
        return d.data;
    }

    return (
        <>
            <div className="row">
                <Async promiseFn={getData}>
                    {({ data, error, isPending }) => {
                        if (isPending) return (<>Loading..</>);
                        if (error) return (<>No results</>);
                        if (data) {
                            return (<>
                                <h2 className="stocks-title">{(query ? count + ' Results for "' + decodeURI(query) + '"' : "All Stocks")}</h2>
                                {data.map(stock => (<StockWidget stock={stock} key={"stock" + stock.id} />))}
                                </>)
                        }
                    }}
                </Async>
            </div>
        </>
    );
}

export default Stocks;
