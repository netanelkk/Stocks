import React, { useState, useEffect, useRef } from 'react'
import { useParams } from "react-router-dom";
import { fetchBySymbol, fetchSuggestions, fetchGraph, addComment, fetchComments, deletecomment, removesaved, addsaved } from '../../api';
import { graph, graphwidth } from '../../plugins/graph';
import { Tooltip } from 'react-tooltip';
import { StockWidget } from '../stock/widget';
import Async from "react-async";
import ReactTimeAgo from 'react-time-ago'
import 'react-tooltip/dist/react-tooltip.css'

let graphdata = { data: [], pred: [], dates: [] };
const Graph = ({ stockid }) => {
    const graphRef = useRef(null);
    const [dots, setDots] = useState(null);
    const [graphDots, setGraphDots] = useState(null);
    const [range, setRange] = useState(30);

    useEffect(() => {
        window.addEventListener("resize", debounce);
        return () => {
            window.removeEventListener("resize", debounce);
        }
    }, []);

    var timer;
    function debounce() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(refreshGraph, 100);
    }

    function refreshGraph() {
        setGraphDots(graph(graphRef.current, graphdata.data, graphdata.pred, graphdata.dates));
    }

    useEffect(() => {
        (async () => {
            const d = await fetchGraph(stockid, range);
            if (!d.pass) throw new Error(d.msg);
            graphdata = { data: [], pred: [], dates: [] };
            initGraphData(d.data);
            refreshGraph();
        })();
    }, [range]);

    useEffect(() => {
        if (dots && graphDots) {
            if (graphDots.length > 1) {
                cleanDots();
                const width = graphwidth();
                for (let i = 1; i <= graphDots.length; i++) {
                    document.getElementById("point" + i).style.left = (width * (i - 1) + 50) + "px";
                    document.getElementById("point" + i).style.paddingTop = (graphDots[i - 1].y) + "px";
                    document.getElementById("point" + i).style.width = width + "px";
                    document.getElementById("point" + i).style.display = "block";

                    document.getElementById("point" + i).classList.remove("raise");
                    document.getElementById("point" + i).classList.remove("fall");

                    const tipdata = {
                        date: graphdata.dates[i - 1],
                        price: graphDots[i - 1].val + (!isNaN(graphDots[i - 1].val) ? " $" : ""),
                        prediction: ""
                    }

                    if (graphDots[i - 1].pred > 0) {
                        document.getElementById("point" + i).classList.add("raise");
                        tipdata.prediction = "<b>PREDICTED</b><i class='bi bi-chevron-compact-up raise'></i>";
                    } else if (graphDots[i - 1].pred < 0) {
                        document.getElementById("point" + i).classList.add("fall");
                        tipdata.prediction = "<b>PREDICTED</b><i class='bi bi-chevron-compact-down fall'></i>";
                    }

                    document.getElementById("point" + i).setAttribute("data-tooltip-html", "<div>" + tipdata.date + "</div><h3>" + tipdata.price + "</h3>" + tipdata.prediction);
                    document.getElementById("point" + i).setAttribute("data-tooltip-id", "tooltip");

                }
            }
        }
    }, [dots, graphDots]);

    const cleanDots = () => {
        const points = document.getElementsByClassName("point-space");
        for (let i = 0; i < points.length; i++) {
            points[i].style.display = "none";
        }
    }

    const initGraphData = (stockdata) => {
        let dotselements = [];
        for (let i = stockdata.length - 1; i >= 0; i--) {
            if (stockdata[i].close !== null) {
                graphdata.data.push(stockdata[i].close);
            }

            graphdata.pred.push(stockdata[i].prediction);
            graphdata.dates.push(formatdate(stockdata[i].date));

            dotselements.push(<div className='point-space' id={"point" + (i + 1)} key={"point" + (i + 1)}>
                <div className='point'></div>
            </div>);
        }
        setDots(dotselements);
    };

    function formatdate(fulldate) {
        const date = new Date(fulldate);
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear() - 2000;
        return (d <= 9 ? '0' + d : d) + '.' + (m <= 9 ? '0' + m : m) + '.' + y;
    }

    return (
        <>
            <div className="graph-menu">
                <div className="graph-hint">
                    <span>Predicted:</span>
                    <div className="hint">
                        <i className="bi bi-chevron-compact-up raise"></i>
                        <span>RAISE</span>
                    </div>
                    <div className="hint">
                        <i className="bi bi-chevron-compact-down fall"></i>
                        <span>FALL</span>
                    </div>
                </div>
                <ul>
                    <li className={(range === 7) ? "active" : ""} onClick={() => { setRange(7); setDots(null); }}>1 week</li>
                    <li className={(range === 30) ? "active" : ""} onClick={() => { setRange(30); setDots(null); }}>1 month</li>
                    <li className={(range === 365) ? "active" : ""} onClick={() => { setRange(365); setDots(null); }}>1 year</li>
                </ul>
            </div>

            <div id="graph">
                <div className="graph-dots">
                    {dots}
                </div>
                {!dots ? <div className='loading-large' style={{ position: "absolute", right: 0, left: 0 }}></div> : ""}
                <canvas width="0" height="400" ref={graphRef} className={!dots ? "hide" : ""}></canvas>
            </div>
        </>
    )
}

const StockElements = ({ data }) => {
    const [add, setAdd] = useState(data.saved);
    const [loading, setLoading] = useState(false);

    const menuOptionClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        let d = (!add ? await addsaved(data.id) : await removesaved(data.id));
        if (d.pass) {
            setAdd(val => !val);
        } else {
            alert("error");
        }
        setLoading(false);
    }


    useEffect(() => {
        if (data.saved) {
            document.getElementsByClassName("stock-saved")[0].style.display = "none";
            setTimeout(() => {
                document.getElementsByClassName("stock-saved")[0].style.display = "block";
            }, 10);
        }
    }, [add]);

    return (
        <>
            <div id="stockpage-title">
                <div className="stock-img">
                    <div>
                        <img src={window.PATH + "/images/stocks/" + data.icon} />
                    </div>
                </div>
                <h1>{data.name + " (" + data.symbol + ")"}</h1>

                {data.saved !== undefined && !loading &&
                    <div className="stock-box">
                        <div className='stock-saved' onClick={e => menuOptionClick(e)}
                            data-tip={!add ? "Add to saved" : "Remove from saved"}>
                            {!add ? <i className="bi bi-bookmark"></i> : <i className="bi bi-bookmark-fill"></i>}
                        </div>
                    </div>
                }

                {loading && <div className='loading'></div>}

                <div className="stock-box">
                    <span className="stock-price">{"$" + data.close}</span>
                    <div className={"stock-info " + ((data.stock_difference < 0) ? "negative" : "positive")}>
                        <span>{data.stock_difference}</span>
                        <span>{data.stock_difference_percentage + "%"}</span>
                    </div>
                </div>
            </div>


            <Graph stockid={data.id} />


            <div className="row" id="detailsrow">
                <div className="col-lg-6">
                    <div className="detailblock">
                        <h2>Today's Oscillator</h2>
                        <table>
                            <thead>
                                <tr>
                                    <td>${data.open}</td>
                                    <td>${data.high}</td>
                                    <td>${data.low}</td>
                                    <td>${data.close}</td>
                                </tr>

                            </thead>
                            <tbody>
                                <tr>
                                    <td>Open</td>
                                    <td>High</td>
                                    <td>Low</td>
                                    <td>Close</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="detailblock" id="stockdetail">
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
        }else{
            alert("Unexpected error, try again");
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
    const loading = (show = true) => {
        if (show) {
            setDisabled(true);
            setActionText(loadingText);
        } else {
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
                {!isUserSignedIn &&
                    <div id="guest-comment">You must be <a href="#">logged in</a> to comment</div>}
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
            <Tooltip id="tooltip" classNameArrow="tooltip-arrow" />
            <Async promiseFn={getData}>
                {({ data, error, isPending }) => {
                    if (isPending) return (<div className='loading-large' style={{ height: "200px" }}></div>);
                    if (error) return (<div id="notice">
                        <i className="bi bi-exclamation-circle"></i>
                        <p>
                            <h3>Couldn't obtain page</h3>
                            <p>Try again later. if you encounter this problem again, check the URL spelled correctly.</p>
                        </p>
                    </div>);
                    if (data) {
                        return (<>
                            <StockElements data={data} />

                            <Discussion isUserSignedIn={isUserSignedIn} stockid={data.id} />

                            <h1 id="seealso">See Also</h1>
                            <Async promiseFn={getSuggestions}>
                                {({ data, error, isPending }) => {
                                    if (isPending) return (<div className='loading-sug'></div>);
                                    if (error) return (<>error</>);
                                    if (data) {
                                        return (
                                            <>
                                                <div className="row" id="nomargin">
                                                    {data.map(stock => (<StockWidget stock={stock} key={"suggestion" + stock.id} optionClick={() => { }} />))}
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
