import React, { useState, useEffect, useRef } from 'react'
import { StockWidget } from '../stock/widget';
import { fetchHome, fetchArticles } from '../../api';
import Async from "react-async";
import { Link } from "react-router-dom";

const Article = ({ data }) => {
    return (
        <div className="col-lg-4">
            <div className="article">
                <h2>{data.title}</h2>
                <span>Published {data.date}</span>
                <p>
                    {data.content}
                </p>
                <div><a href={data.link} target="_blank"><button>Continue Reading<i className="bi bi-box-arrow-up-right"></i></button></a></div>
            </div>
        </div>
    );
}

function Homepage() {
    const [homeStocks, setHomeStocks] = useState(null);

    useEffect(() => {
        (async () => {
            const d = await fetchHome();
            if (!d.pass) return;
            setHomeStocks(d.data);

        })();
    }, []);


    useEffect(() => {
        if (homeStocks)
            carousel();
    }, [homeStocks]);

    const getArticles = async () => {
        const d = await fetchArticles();
        if (!d.pass) throw new Error(d.msg);
        return d.data;
    }

    let frame = 1, interval;
    const carousel = () => {
        interval = setInterval(intervalfun, 3000);
    }

    const pause = () => {
        console.log("PAUSE");
        clearInterval(interval);
        document.querySelectorAll(".carousel-progress")[0].classList.add("pause");
        document.querySelectorAll(".carousel-progress")[0].classList.remove("startprogress");
    }

    const play = () => {
        console.log("PLAY");
        interval = setInterval(intervalfun, 3000);
        document.querySelectorAll(".carousel-progress")[0].classList.remove("pause");
        document.querySelectorAll(".carousel-progress")[0].classList.add("startprogress");
    }

    let preframe;
    const intervalfun = (back = false,customframe=false) => {
        if (back) {
            document.querySelectorAll(".row .stock-widget")[0].classList.remove("frame2");
            document.querySelectorAll(".row .stock-widget")[0].classList.remove("frame3");
            document.querySelectorAll(".row .stock-widget")[0].classList.remove("frame4");
            if(!customframe) frame--;
            removeActive();
            if (frame < 1) {
                frame = 4;
                document.querySelectorAll(".row .stock-widget")[0].classList.add("frame2");
                document.querySelectorAll(".row .stock-widget")[0].classList.add("frame3");
                document.querySelectorAll(".row .stock-widget")[0].classList.add("frame4");
            }
            document.querySelectorAll(".row .stock-widget")[0].classList.add("frame"+frame);
            document.querySelectorAll(".carousel-nav li")[frame-1].classList.add("active");
        } else {
            if(!customframe) frame++;
            removeActive();
            if (frame > 4) {
                document.querySelectorAll(".row .stock-widget")[0].className = "stock-widget";
                document.querySelectorAll(".row .stock-widget")[0].classList.add("col-lg-3");
                frame = 1;
            }
            document.querySelectorAll(".carousel-nav li")[frame-1].classList.add("active");
            document.querySelectorAll(".row .stock-widget")[0].classList.add("frame" + frame);
        }
        
    }

    const removeActive = () => {
        let dots = document.querySelectorAll(".carousel-nav li");
        for(let i = 0; i < dots.length; i++) {
            dots[i].classList.remove("active");
        }
    }
    const navClick = (index) => {
        preframe = frame;
        frame = index;
        intervalfun((preframe>index),true);
    }

    /*
                <button className="page-button">+ Add Stock</button>
            <div style={{ clear: "both" }}></div>
            */

    return (
        <>
            <div className="carousel" onMouseEnter={pause} onMouseLeave={play}>
                <div className="control">
                    <div className="control-arrows">
                        <div className='arrow-left' onClick={() => { intervalfun(true); }}><i className="bi bi-chevron-left"></i></div>
                        <div className='arrow-right' onClick={() => { intervalfun(); }}><i className="bi bi-chevron-right"></i></div>
                    </div>
                    <div className='progress-container'>
                        <div className='carousel-progress startprogress'></div>
                    </div>
                </div>
                <div className="row">
                    {homeStocks &&
                        homeStocks.map(stock => (<><StockWidget stock={stock} key={"stock" + stock.id} /></>))}
                </div>
                
            <ul className="carousel-nav">
                <li className='active' onClick={() => { navClick(1); }}></li>
                <li onClick={() => { navClick(2); }}></li>
                <li onClick={() => { navClick(3); }}></li>
                <li onClick={() => { navClick(4); }}></li>
            </ul>
            </div>
            <div className='button-row'>
                <Link to={window.PATH + "/stocks"} className="expand-button">
                    View All
                </Link>
            </div>

            <h1>Recent News</h1>
            <div className="row articles">
                <Async promiseFn={getArticles}>
                    {({ data, error, isPending }) => {
                        if (isPending) return (<>Loading..</>);
                        if (error) return (<>error</>);
                        if (data) {
                            return data.map(article => (<Article data={article} key={"article" + article.id} />));
                        }
                    }}
                </Async>
            </div>
        </>
    );
}

export default Homepage;
