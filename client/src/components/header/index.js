import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { suggestion } from '../../api';

const Suggestion = ({ data, isActive }) => {
    return (
        <Link to={window.PATH + "/stock/" + data.symbol}>
            <div className={"suggestion-row"+((isActive) ? " active" : "")}>
                <div className="stock-img">
                    <div>
                        <img src={window.PATH + "/images/stocks/" + data.icon} />
                    </div>
                </div>
                <div className="stock-data">
                    <div className="stock-title">
                        <h2>{data.name}</h2>
                    </div>
                    <div className="stock-price">${data.price}</div>
                </div>
            </div>
        </Link>
    );
}

var sugIndexValue = -1;
const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggetions] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sugIndex, setSugIndex] = useState(sugIndexValue);
    const [showSearch, setShowSearch] = useState(false);
    const inputRef = useRef(null);

    const navigate = useNavigate();
    const onQueryChange = (event) => {
        setShowSuggetions(true);
        setSearchQuery(event.target.value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (searchQuery !== "") {
            setShowSuggetions(false);
            inputRef.current.blur();
            if (sugIndexValue < 0 || sugIndexValue === 6) {
                navigate(window.PATH + "/stocks/" + encodeURIComponent(encodeURIComponent((searchQuery))));
            } else {
                navigate(window.PATH + "/stock/" + data[sugIndexValue].symbol);
            }
            setSugIndex(-1);
            sugIndexValue = -1;
        }
    };

    useEffect(() => {
        const getSuggestions = async () => {
            setLoading(true);
            const d = await suggestion(searchQuery);
            if (!d.pass) {
                setLoading(false);
                setShowSuggetions(false);
            } else {
                setData(d.data);
                console.log(d.data);
                setLoading(false);
            }
        }
        if (searchQuery !== "")
            getSuggestions();
        else
            setShowSuggetions(false);
    }, [searchQuery]);

    const wrapperRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggetions(false);
                setSugIndex(-1);
                sugIndexValue = -1;
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);


    const onKeyPressed = (e) => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                sugIndexValue = (sugIndexValue + 1 < 7) ? sugIndexValue + 1 : sugIndexValue;
                setSugIndex(sugIndexValue);
                break;
            case "ArrowUp":
                e.preventDefault();
                sugIndexValue = (sugIndexValue - 1 >= 0) ? sugIndexValue - 1 : sugIndexValue;
                setSugIndex(sugIndexValue);
                break;
        }
    }

    return (
        <div className="search">
            <form onSubmit={onSubmit} id="search-form">
                <div className="search-container" ref={wrapperRef}>

                    <input type="text" placeholder="Search for stock.." value={searchQuery} onChange={onQueryChange} onKeyDown={onKeyPressed}
                        onFocus={() => { if (searchQuery !== "") { setShowSuggetions(true); } }} ref={inputRef}
                        className={showSuggestions ? "searchinput active" : ""} />

                    {showSuggestions && <div className="search-suggestion" onClick={() => { setShowSuggetions(false); }}>
                        {loading && <div id="sug-loading"></div>}
                        {data.map((row, index) => (<Suggestion key={row.id} data={row} isActive={(index === sugIndex)} />))}
                        <div className={"suggestions-showmore" + ((sugIndex === 6) ? " active" : "")} onClick={onSubmit}>Show All Results</div>
                    </div>
                    }
                </div>
                <button type="submit" onClick={() => setShowSearch(true)}><i className="bi bi-search"></i></button>
            </form>
        </div>
    )
}

function Header() {
    return (
        <div className="header">
            <Link to={window.PATH}>
                <div className="logo">
                    <i className="bi bi-graph-up"></i> Stocks
                </div>
            </Link>
            <Search />
            <div className="userheader">
                <img src="https://cdn4.buysellads.net/uu/1/127419/1670532337-Stock2.jpg" />
                <i className="bi bi-chevron-down"></i>
            </div>
        </div>
    );
}

export default Header;
