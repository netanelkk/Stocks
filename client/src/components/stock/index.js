import React, { useState, useEffect, useRef } from 'react'
import { useParams } from "react-router-dom";
import { fetchBySymbol, fetchSuggestions, fetchGraph } from '../../api';
import { graph } from './graph';
import ReactTooltip from 'react-tooltip';
import { StockWidget } from '../stock/widget';
import Async from "react-async";

function round3digits(x) {
    return Math.round(x * 1000) / 1000;
}

const Graph = ({stockid}) => {
    const graphRef = useRef(null);
    const [dots, setDots] = useState(null);
    const [graphDots, setGraphDots] = useState(null);
    const [range, setRange] = useState(30);


    useEffect(() => {
        (async () => {
            const d = await fetchGraph(stockid, range);
            if (!d.pass) throw new Error(d.msg);
            let graphdata = { data: [], pred: [], dates: [] };
            initGraphData(d.data, graphdata);
            setGraphDots(graph(graphRef.current, graphdata.data, graphdata.pred, graphdata.dates));
        })();
    }, [range]);

    useEffect(() => {
        if (dots && graphDots) {
            if (graphDots.length > 1) {
                cleanDots();
                for (let i = 1; i <= graphDots.length; i++) {
                    document.getElementById("point" + i).style.left = (graphDots[i - 1].x - 20) + "px";
                    document.getElementById("point" + i).style.top = (graphDots[i - 1].y) + "px";
                    document.getElementById("point" + i).style.display = "block";
                    document.getElementById("point" + i).setAttribute("data-tip", graphDots[i - 1].val + " $");
                }
                ReactTooltip.rebuild();
            }
        }
    }, [dots, graphDots]);

    const cleanDots = () => {
        const points = document.getElementsByClassName("point-space");
        for(let i = 0; i < points.length; i++) {
            points[i].style.display = "none";
        }
    }

    const initGraphData = (stockdata, graphdata) => {
        let dotselements = [];
        for (let i = stockdata.length - 1; i >= 0; i--) {
            if (stockdata[i].close) {
                graphdata.data.push(stockdata[i].close);
            }

            graphdata.pred.push(stockdata[i].predclose);

            let onlydate = /\d{4}-\d{2}-\d{2}/.exec(stockdata[i].date);
            graphdata.dates.push(onlydate);

            dotselements.push(<div className='point-space' id={"point" + (i + 1)} key={"point" + (i + 1)}>
                <div className='point'></div>
            </div>);
            dotselements.push(<div className='point-space' id={"point" + (stockdata.length + i + 1)} key={"point" + (stockdata.length + i + 1)}>
                <div className='point'></div>
            </div>);
        }
        setDots(dotselements);
    };

    return (
        <>
            <div className="graph-menu">
                <div className="graph-hint">
                    <div className="hint">
                        <div id="actual-line"></div>
                        <span>ACTUAL</span>
                    </div>
                    <div className="hint">
                        <div id="predicted-line"></div>
                        <span>PREDICTED</span>
                    </div>
                </div>
                <ul>
                    <li className={(range===7) ? "active" : ""} onClick={() => { setRange(7) }}>1 week</li>
                    <li className={(range===30) ? "active" : ""} onClick={() => { setRange(30) }}>1 month</li>
                    <li className={(range===365) ? "active" : ""} onClick={() => { setRange(365) }}>1 year</li>
                </ul>
            </div>

            <div id="graph">
            <div className="graph-dots">
                {dots}
            </div>
            <canvas width="0" height="300" ref={graphRef}></canvas>
            </div>
        </>
    )
}

const StockElements = ({ data }) => {
    const [stockDifference, setStockDifference] = useState(0);
    const [stockDifferencePercentage, setStockDifferencePercentage] = useState(0);

    const calculateDiff = () => {
        const stockdiff = data.preprice != 0 ? round3digits(data.close - data.preprice) : 0;
        const stockdiffper = (data.preprice != 0 ? round3digits(stockdiff / data.preprice * 100) : 0);
        setStockDifference(stockdiff);
        setStockDifferencePercentage(stockdiffper);
    }

    useEffect(() => {
        calculateDiff();
    }, []);

    return (
        <>
            <div id="stockpage-title">
                <div className="stock-img">
                    <div>
                        <img src={window.PATH + "/images/stocks/" + data.icon} />
                    </div>
                </div>
                <h1>{data.name + " (" + data.symbol + ")"}</h1>
                <div>
                    <span className="stock-price">{"$" + data.close}</span>
                    <div className={"stock-info " + ((stockDifference < 0) ? "negative" : "positive")}>
                        <span>{stockDifference}</span>
                        <span>{isNaN(stockDifferencePercentage) ? 0 : stockDifferencePercentage + "%"}</span>
                    </div>
                </div>
            </div>


            <Graph stockid={data.id} />


            <div className="row" id="detailsrow">
                <div className="col-lg-6">
                    <div className="detailblock">
                        <h2>Stock Details</h2>
                        <table>
                            <thead>
                                <tr>
                                    <td></td>
                                    <td>Open</td>
                                    <td>High</td>
                                    <td>Low</td>
                                    <td>Close</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Actual</td>
                                    <td>${data.open}</td>
                                    <td>${data.high}</td>
                                    <td>${data.low}</td>
                                    <td>${data.close}</td>
                                </tr>
                                <tr>
                                    <td>Predicated</td>
                                    <td>${data.predopen}</td>
                                    <td>${data.predhigh}</td>
                                    <td>${data.predlow}</td>
                                    <td>${data.predclose}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="detailblock">
                        <h2>About {data.name}</h2>
                        <p>
                            {data.about}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

function Stock(props) {
    const { topRef } = props;
    const { symbol } = useParams();

    useEffect(() => {
        topRef.current.scrollTop = 0;
    }, [symbol]);

    const getData = async () => {
        const d = await fetchBySymbol(symbol);
        if (!d.pass) throw new Error(d.msg);
        return d.data[0];
    }

    const getSuggestions = async () => {
        const d = await fetchSuggestions(symbol);
        if (!d.pass) return;
        return d.data;
    }

    return (
        <>
            <ReactTooltip />

            <Async promiseFn={getData}>
                {({ data, error, isPending }) => {
                    if (isPending) return (<>Loading..</>);
                    if (error) return (<>error</>);
                    if (data) {
                        return (<>
                            <StockElements data={data} />

                            <h1>Discussion</h1>
                            <div className="discussion-box">
                                <div className="new-comment">
                                    <input type="text" placeholder="Write a comment..." />
                                    <button><i className="bi bi-send-fill"></i></button>
                                </div>
                                <div className="comments">
                                    <div className="comment">
                                        <span><b>Nati</b> &#183; 5 hours ago</span>
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>
                                    <div className="comment">
                                        <span><b>Guy</b> &#183; 7 hours ago</span>
                                        <p>
                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                        </p>
                                    </div>
                                    <div className="comment">
                                        <span><b>Adir</b> &#183; 12 hours ago</span>
                                        <p>
                                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Async promiseFn={getSuggestions}>
                                {({ data, error, isPending }) => {
                                    if (isPending) return (<>Loading..</>);
                                    if (error) return (<>error</>);
                                    if (data) {
                                        return (
                                            <>
                                                <h1>See Also</h1>
                                                <div className="row">
                                                    {data.map(stock => (<StockWidget stock={stock} key={"suggestion" + stock.id} />))}
                                                </div>
                                            </>
                                        )
                                    }
                                }}
                            </Async>
                        </>)
                    }
                }}
            </Async>
        </>
    );
}

export default Stock;
