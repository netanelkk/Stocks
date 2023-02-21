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
                <div><a href={data.link} target="_blank"><button>Continue Reading <i className="bi bi-box-arrow-up-right"></i></button></a></div>
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

    const getArticles = async () => {
        const d = await fetchArticles();
        if (!d.pass) throw new Error(d.msg);
        return d.data;
    }

    return (
        <>
            <button className="page-button">+ Add Stock</button>
            <div style={{ clear: "both" }}></div>
            <div className="row">
                {homeStocks &&
                    homeStocks.map(stock => (<StockWidget stock={stock} key={"stock" + stock.id} />))}
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
