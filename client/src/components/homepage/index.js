import React, { useState, useEffect, useRef } from 'react'
import { StockWidget } from '../stock/widget';
import { fetchHome, fetchArticles, addsaved } from '../../api';
import Async from "react-async";
import { Link } from "react-router-dom";
import { Carousel } from "./carousel";

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
        if (homeStocks) {
            Carousel.init();
        }

        // clear interval on unmount
        return () => {
            clearInterval(Carousel.interval);
        };
    }, [homeStocks]);

    const getArticles = async () => {
        const d = await fetchArticles();
        if (!d.pass) throw new Error(d.msg);
        return d.data;
    }

    return (
        <>
            {homeStocks && <>
                <div className="carousel" onMouseEnter={Carousel.pause} onMouseLeave={Carousel.play}>
                    <div className="control">
                        <div className='arrow-left' onClick={() => { Carousel.intervalfun(true); }}><i className="bi bi-chevron-left"></i></div>
                        <div className='progress-container'>
                            <div className='carousel-progress'></div>
                        </div>
                        <div className='arrow-right' onClick={() => { Carousel.intervalfun(); }}><i className="bi bi-chevron-right"></i></div>
                    </div>
                    <div style={{ clear: "both" }}></div>
                    <div className="row">
                        {
                            homeStocks.map(stock => (
                                <StockWidget stock={stock} key={"stock" + stock.id} optionClick={() => { }} />
                            ))}
                    </div>

                    <ul className="carousel-nav">
                        <li className='active' onClick={() => { Carousel.navClick(1); }}></li>
                        <li onClick={() => { Carousel.navClick(2); }}></li>
                        <li onClick={() => { Carousel.navClick(3); }}></li>
                        <li onClick={() => { Carousel.navClick(4); }}></li>
                    </ul>
                </div>
                <div className='button-row'>
                    <Link to={window.PATH + "/stocks"} className="expand-button">
                        View All
                    </Link>
                </div></>}
            {!homeStocks && <div className="loading-large"></div>}
            <h1>Recent News</h1>
            <div className="row articles">
            {homeStocks &&
                <Async promiseFn={getArticles}>
                    {({ data, error, isPending }) => {
                        if (isPending) return (<div className='loading-large' style={{height:"400px"}}></div>);
                        if (error) return (<div id="notice"><i className="bi bi-exclamation-circle"></i> Couldn't load news</div>);
                        if (data) {
                            return data.map(article => (<Article data={article} key={"article" + article.id} />));
                        }
                    }}
                </Async>}
            </div>
        </>
    );
}

export default Homepage;
