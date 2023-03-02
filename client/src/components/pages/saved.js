import React, { useState, useEffect, useRef } from 'react'
import { StockWidget } from '../stock/widget';
import { mysaved, reorder } from '../../api';
import { Sort } from './sort';
import Async from "react-async";

function Saved(props) {
    const { topRef, isUserSignedIn } = props;
    const [refreshState, setRefreshState] = useState(0);

    const getSaved = async () => {
        const d = await mysaved();
        if (!d.pass) throw new Error(d.msg);
        const stockmap = [];
        for (let i = 0; i < d.data.length; i++) {
            stockmap.push(d.data[i].id);
        }
        Sort.init(d.data.length, stockmap, reorder);
        return d.data;
    }

    const optionClick = () => {
        setRefreshState(val => val + 1);
    }

    useEffect(() => {
        topRef.current.scrollTop = 0;

        return () => {
            Sort.kill();
        };
    }, []);

    return (
        <div>
            <div className="stocks-title">
                <h2>Saved Stocks</h2>
            </div>
            <div className='row dragrow' id="dragparent" onDragOver={e => { e.preventDefault(); }}>
                {isUserSignedIn &&
                    <Async promiseFn={getSaved}>
                        {({ data, error, isPending }) => {
                            if (isPending) return (<div className='loading-large' style={{height:"400px"}}></div>);
                            if (error) return (<div id="notice">
                                                    <p>Click on <i className="bi bi-bookmark" id=""></i> icon to add stocks</p>
                                                </div>);
                            if (data) {
                                return data.map((stock, i) => (<StockWidget stock={stock} key={"stock" + stock.id}
                                    Sort={Sort} i={i} optionClick={optionClick} />));
                            }
                        }}
                    </Async>}

                {!isUserSignedIn &&
                    <div id="notice">
                        <i className="bi bi-exclamation-circle"></i>
                        <p>
                            <h3>Access Limited</h3>
                            <p>Sign in to manage saved stocks</p>
                        </p>
                    </div>
                }
            </div>
        </div>
    );
}

export default Saved;
