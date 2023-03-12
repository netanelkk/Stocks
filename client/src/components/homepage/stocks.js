import React, { useState, useEffect, useRef } from 'react'
import { StockWidget } from '../stock/widget';
import { fetchAll, fetchCategories } from '../../api';
import { useParams } from "react-router-dom";
import Async from "react-async";
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Categories from '../stock/categories';
import { useSearchParams } from 'react-router-dom';

let sortoptions = ["Relevance", "Alphabetic Order (A-Z)", "Stock Price (High to Low)", "Stock Price (Low to High)"];
let sorticons = [<i className="bi bi-filter"></i>,
<i className="bi bi-sort-alpha-down"></i>,
<i className="bi bi-sort-numeric-down-alt"></i>,
<i class="bi bi-sort-numeric-up-alt"></i>];
const StocksPage = (props) => {
    const { query, catId } = props;
    const [data, setData] = useState(props.data);
    const [activeSort, setActiveSort] = useState(1);
    const [categories, setCategories] = useState();
    const [filtered, setFiltered] = useState(catId ? [catId] : []);


    const order = (index) => {
        setData(getsorted([...data], index));
        setActiveSort(index);
    }

    const getsorted = (arr, index) => {
        switch (index) {
            case 1:
                arr.sort((a, b) => { return a.id > b.id });
                break;
            case 2:
                arr.sort((a, b) => { return a.name > b.name });
                break;
            case 3:
                arr.sort((a, b) => { return a.price < b.price });
                break;
            case 4:
                arr.sort((a, b) => { return a.price > b.price });
                break;
        }
        return arr;
    }

    useEffect(() => {
        (async () => {
            const d = await fetchCategories();
            if (!d.pass) return;
            setCategories(d.data);
        })();
    }, []);

    useEffect(() => {
        if (filtered.length > 0) {
            setData(getsorted(props.data.filter(val => { return filtered.includes(val.category) }), activeSort));
        } else {
            setData(getsorted(props.data, activeSort));
        }
    }, [filtered]);


    return (
        <>
            <div className="stocks-title">
                <h2>{(query ? data.length + ' Results for "' + decodeURI(query) + '"' : "All Stocks (" + data.length + ")")}</h2>
                <Navbar bg="light">
                    <Container>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <NavDropdown title={"Sort by " + sortoptions[activeSort - 1]} id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={() => { order(1) }} className={((activeSort === 1) ? "active" : "")}>
                                        {sorticons[0]} {sortoptions[0]}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => { order(2) }} className={((activeSort === 2) ? "active" : "")}>
                                        {sorticons[1]} {sortoptions[1]}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => { order(3) }} className={((activeSort === 3) ? "active" : "")}>
                                        {sorticons[2]} {sortoptions[2]}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => { order(4) }} className={((activeSort === 4) ? "active" : "")}>
                                        {sorticons[3]} {sortoptions[3]}
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>

            <Categories categories={categories} filtered={filtered} setFiltered={setFiltered} />

            {data.map(stock => (<StockWidget stock={stock} key={"stock" + stock.id} optionClick={() => { }} />))}
        </>)
}

function Stocks(props) {
    const { topRef } = props;
    const { query } = useParams();
    const [searchParams] = useSearchParams();
    const [catId, setCatId] = useState(0);

    useEffect(() => {
        topRef.current.scrollTop = 0;
    }, [query]);

    useEffect(() => {
        const cat = searchParams.get('cat');
        if(cat) {
            setCatId(Number(cat));
        }
    }, [searchParams]);

    const getData = async () => {
        const d = await fetchAll((query) ? query : "");
        if (!d.pass) throw new Error(d.msg);
        return d.data;
    }

    return (
        <>

            <div className="row">
                <Async promiseFn={getData}>
                    {({ data, error, isPending }) => {
                        if (isPending) return (<div className='loading-large' style={{ height: "400px" }}></div>);
                        if (error) return (
                            <>
                                <div className="stocks-title">
                                    <h2>0 Results</h2>
                                </div>
                                <div id="notice"><i className="bi bi-exclamation-circle"></i> No results found</div>
                            </>
                        );
                        if (data) {
                            return (
                                <StocksPage data={data} query={query} catId={catId} />
                            );
                        }
                    }}
                </Async>
            </div>
        </>
    );
}

export default Stocks;
