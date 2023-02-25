import React, { useState, useEffect, useRef } from 'react'
import { StockWidget } from '../stock/widget';
import { fetchAll, fetchCategories } from '../../api';
import { useParams } from "react-router-dom";
import Async from "react-async";
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

let filteredvar = [];
const Cat = ({ cat, filter }) => {

    return (
        <span className={(filteredvar.includes(cat.id) ? "active" : "")} key={"cat" + cat.id} onClick={() => { filter(cat.id) }}>
            <i className={"bi " + cat.icon}></i>
            {cat.name}
        </span>
    )
};

const Head = ({data,query,count}) => {
    const [categories, setCategories] = useState();
    const [activeSort, setActiveSort] = useState(1);
    const [filtered, setFiltered] = useState([]);

    const order = (index) => {
        switch (index) {
            case 1:
                data.sort((a, b) => { return a.id > b.id });
                break;
            case 2:
                data.sort((a, b) => { return a.name > b.name });
                break;
            case 3:
                data.sort((a, b) => { return a.price < b.price });
                break;
        }
        setActiveSort(index);
    }

    useEffect(() => {
        (async () => {
            const d = await fetchCategories();
            if (!d.pass) return;
            setCategories(d.data);
        })();
    });

    const filter = (catid) => {
        console.log(filteredvar);
        if (filteredvar.includes(catid)) {
            filteredvar = [...filtered];
            filteredvar.unshift(catid);
            setFiltered([]);
        } else {
            filteredvar.push(catid);
            setFiltered(items => [catid].concat(items));
        }
        console.log(filtered);
    }

    return (
        <>
            <div className="stocks-title">
                <h2>{(query ? count + ' Results for "' + decodeURI(query) + '"' : "All Stocks (" + count + ")")}</h2>
                <Navbar bg="light">
                    <Container>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <NavDropdown title="Sort by" id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={() => { order(1) }} className={((activeSort === 1) ? "active" : "")}>
                                        Relevance
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => { order(2) }} className={((activeSort === 2) ? "active" : "")}>
                                        Alphabetic Order (A-Z)
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => { order(3) }} className={((activeSort === 3) ? "active" : "")}>
                                        Stock Price (High to Low)
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
            <div className='categories'>
                {categories &&
                    categories.map(cat => (<Cat cat={cat} key={"cat" + cat.id} filter={filter} />))
                }
            </div>
        </>
    )
}

const StocksPage = (props) => {
    const { query, count } = props;
    const [data, setData] = useState(props.data);
    
    return (<>
        <Head data={data} query={query} count={count} />
        {data.map(stock => (<StockWidget stock={stock} key={"stock" + stock.id} />))}
    </>)
}

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
                            return (
                                <StocksPage data={data} count={count} query={query} />
                            );
                        }
                    }}
                </Async>
            </div>
        </>
    );
}

export default Stocks;
