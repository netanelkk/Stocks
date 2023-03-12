import React, { useState, useEffect, useRef } from 'react'
import { StockWidget } from '../stock/widget';
import { fetchHome, fetchArticles, addsaved, fetchCategories } from '../../api';
import Async from "react-async";
import { Link } from "react-router-dom";
import { Carousel } from "../../plugins/carousel";
import Categories from '../stock/categories';

const Article = ({ data }) => {
    return (
        <div className="col-lg-4">
            <div className="article">
                <div className='article-image'
                    style={{ backgroundImage: "url(" + data.image + ")" }}></div>
                <h2>{data.title}</h2>
                <span>Published at {data.date}</span>
                <div><a href={data.link} target="_blank"><button>Continue Reading<i className="bi bi-box-arrow-up-right"></i></button></a></div>
            </div>
        </div>
    );
}

const Slider = () => {
    const [homeStocks, setHomeStocks] = useState(null);
    const [categories, setCategories] = useState();

    useEffect(() => {
        (async () => {
            let d = await fetchHome();
            if (d.pass)
            setHomeStocks(d.data);

            d = await fetchCategories();
            if (d.pass)
            setCategories(d.data);
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

    return (
        <>

            {!homeStocks && <div className="loading-large"></div>}
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
                    <Categories categories={categories} />
                    <Link to={window.PATH + "/stocks"} className="expand-button">
                        View All
                    </Link>
                </div>
            </>}
        </>
    )
}


const Top3 = () => {

    return (
        <div className="row">
            <div className="topblock col-lg-4">
                <div className="main-top">
                    <div className="successrate">
                        96%
                        <div>Success Rate</div>
                    </div>
                    <div className="topblock-img">
                        <img src="http://localhost:3000/images/stocks/apple.png" />
                    </div>
                    <h2>Apple Inc.</h2>
                </div>
            </div>
            <div className="topblock col-lg-4">
                <div className="main-top">
                    <div className="successrate">
                        98%
                        <div>Success Rate</div>
                    </div>
                    <div className="topblock-img">
                        <img src="http://localhost:3000/images/stocks/meta.png" />
                    </div>
                    <h2>Meta</h2>
                </div>
            </div>
            <div className="topblock col-lg-4">
                <div className="main-top">
                    <div className="successrate">
                        92%
                        <div>Success Rate</div>
                    </div>
                    <div className="topblock-img">
                        <img src="http://localhost:3000/images/stocks/microsoft.png" />
                    </div>
                    <h2>Microsoft</h2>
                </div>
            </div>
        </div>
    )
}

function Homepage() {

    const getArticles = async () => {
        const d = await fetchArticles();
        if (!d.pass) throw new Error(d.msg);
        return d.data;
    }

    return (
        <>
            <Top3 />
            <Slider />
            <h1>Recent News</h1>
            <div className="row articles">
                <Async promiseFn={getArticles}>
                    {({ data, error, isPending }) => {
                        if (isPending) return (<div className='loading-large' style={{ height: "400px" }}></div>);
                        if (error) return (<div id="notice"><i className="bi bi-exclamation-circle"></i> Couldn't load news</div>);
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
