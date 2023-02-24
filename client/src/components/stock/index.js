import React, { useState, useEffect, useRef } from 'react'
import { useParams } from "react-router-dom";
import { fetchBySymbol, fetchSuggestions, fetchGraph, addComment, fetchComments, deletecomment } from '../../api';
import { graph } from './graph';
import ReactTooltip from 'react-tooltip';
import { StockWidget } from '../stock/widget';
import Async from "react-async";
import ReactTimeAgo from 'react-time-ago'

function round3digits(x) {
    return Math.round(x * 1000) / 1000;
}

const Graph = ({ stockid }) => {
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
        for (let i = 0; i < points.length; i++) {
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
            graphdata.dates.push(stockdata[i].date);

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
                    <li className={(range === 7) ? "active" : ""} onClick={() => { setRange(7) }}>1 week</li>
                    <li className={(range === 30) ? "active" : ""} onClick={() => { setRange(30) }}>1 month</li>
                    <li className={(range === 365) ? "active" : ""} onClick={() => { setRange(365) }}>1 year</li>
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

function sendText() {
    return (<><i className="bi bi-send" id="comment-send"></i></>);
}

function deleteText(deleteClick) {
    return (<div className="delete-comment" onClick={deleteClick}><i className="bi bi-x-circle-fill"></i></div>);
}

function loadingText() {
    return (<><div className="loading"></div></>);
}

function commentLoading() {
    return (<><div className="loading" id="comment-loading"></div></>);
}

const AddComment = ({ stockid, setReloadComments }) => {
    const [submitText, setSubmitText] = useState(sendText);
    const [disabled, setDisabled] = useState("");
    const [content, setContent] = useState("");
    const onContentChange = (event) => setContent(event.target.value);

    function addLoading(show = true) {
        if (show) {
            setDisabled("disabled");
            setSubmitText(loadingText);
        } else {
            setDisabled("");
            setSubmitText(sendText);
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        addLoading();
        const sendResult = await addComment(stockid, content);
        if (sendResult.pass) {
            setContent("");
            setReloadComments(val => val + 1);
        }
        addLoading(false);
    };

    return (
        <div className="new-comment">
            <form className="comment-form" onSubmit={onSubmit}>
                <input type="text" value={content} onChange={onContentChange} placeholder="Write a comment..." maxLength="255" required />
                <button disabled={disabled}>{submitText}</button>
            </form>
        </div>
    )
}

const Comment = ({ comment, setCommentCount }) => {
    const commentBox = useRef(null);
    const [disabled, setDisabled] = useState(false);
    const allowDelete = (localStorage.getItem("myid") == comment.userid);
  
    const deleteClick = async (e) => {
        const target = e.currentTarget;
        if (!disabled) {
            target.classList.add("cursor-default");
            loading();
            const d = await deletecomment(comment.id);
            if (!d.pass) {
                alert(d.msg);
            } else {
                commentBox.current.classList.add('hide');
                setCommentCount(x => x - 1);
            }
            loading(false);
            target.classList.remove("cursor-default");
        }

    }

    const [actionText, setActionText] = useState(deleteText(deleteClick));
    const loading = (show=true) => {
        if(show) {
          setDisabled(true);
          setActionText(loadingText);
        }else{
          setDisabled(false);
          setActionText(deleteText(deleteClick));
        }
    }

    return (
        <div className="comment" ref={commentBox}>
            <div className="commenthead">
                <b>{comment.name}</b> {(<div className='tagname'>#{comment.userid}</div>)}
                <span><ReactTimeAgo date={Date.parse(comment.date)} locale="en-US" /></span>
                {allowDelete && actionText}
            </div>
            <p>
                {comment.content}
            </p>
        </div>
    )
}

const MapComments = React.memo(({ data, setCommentCount }) => {
    return (
        data.map(comment => (
            <Comment key={"comment" + comment.id} comment={comment} setCommentCount={setCommentCount} />
        ))
    )
});

const COMMENT_PAGE_OFFSET = 15;
const Discussion = ({ stockid, isUserSignedIn }) => {
    const loadButton = useRef(null);
    const listInnerRef = useRef();
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentCount, setCommentCount] = useState(0);
    const [reloadComments, setReloadComments] = useState(0);

    const loadMore = () => {
        if (page < Math.ceil(commentCount / COMMENT_PAGE_OFFSET)) {
            setPage(page => page + 1);
        }
    }

    const loadComments = async () => {
        setLoading(true);
        const d = await fetchComments(stockid, page);
        if (!d.pass) {
            setLoading(false);
        } else {
            setCommentCount(d.count);
            setData((data) => [...data, ...d.data]);
            setLoading(false);
        }
    }

    useEffect(() => {
        loadComments();
    }, [page]);


    useEffect(() => {
        if (reloadComments > 0) {
            setData([]);
            if (page === 1) loadComments();
            setPage(1);
        }
    }, [reloadComments]);

    useEffect(() => {
        if (!loading && page == Math.ceil(commentCount / COMMENT_PAGE_OFFSET)) {
            loadButton.current.classList.add('hide');
        }
    }, [loading]);


    const onScroll = () => {
        if (listInnerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
            if (scrollTop + clientHeight === scrollHeight) {
                if (page < Math.ceil(commentCount / COMMENT_PAGE_OFFSET)) {
                    setPage(page => page + 1);
                }
            }
        }
    };

    return (
        <>
            <h1>Discussion ({commentCount})</h1>
            <div className="discussion-box">
                {isUserSignedIn &&
                    <AddComment stockid={stockid} setReloadComments={setReloadComments} />}
                <div className="comments" onScroll={() => onScroll()} ref={listInnerRef}>
                    <MapComments data={data} setCommentCount={setCommentCount} />
                    {loading && commentLoading()}
                    {!loading && (commentCount > 0) && <button className="loadmore" onClick={loadMore} ref={loadButton}>Load more comments...</button>}
                    {!loading && (commentCount == 0) &&
                        <div className="comment">
                            <span style={{ fontSize: "10pt" }}>Be the first to add comment</span>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

function Stock(props) {
    const { topRef, isUserSignedIn } = props;
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

                            <Discussion isUserSignedIn={isUserSignedIn} stockid={data.id} />

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
