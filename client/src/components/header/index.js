import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { suggestion, auth, mydetails } from '../../api';
import FacebookLogin from 'react-facebook-login';

var sugIndexValue = -1, sugcount = 0, searchhistory = JSON.parse(localStorage.getItem("searchhistory") ? localStorage.getItem("searchhistory") : '[]');
let historyrows = [], isrecentmode = true, arrownavigation = false;
const Suggestion = ({ index, data, isActive, setReloadHistory, setClose, setSugIndex }) => {
    const removeitem = () => {
        let newsearchhistory = [];
        for (const i in searchhistory) {
            if (searchhistory[i] !== data.name) {
                newsearchhistory.push(searchhistory[i]);
            }
        }
        searchhistory = newsearchhistory;
        console.log(searchhistory);
        setReloadHistory(val => val + 1);
        localStorage.setItem("searchhistory", JSON.stringify(newsearchhistory));
    }

    const itemClick = e => {
        console.log(e.target.className);
        if (e.target.className === 'remove-item' || e.target.className === 'bi bi-x-lg') {
            e.preventDefault();
            removeitem();
        } else {
            setClose(val => val + 1);
            if (!searchhistory.includes(data.name)) searchhistory.push(data.name);
            localStorage.setItem("searchhistory", JSON.stringify(searchhistory));
        }
    }

    const setActiveItem = () => {
        activeItem(index);
    }

    const clearActiveItem = () => {
        activeItem();
    }

    const activeItem = (val = -1) => {
        setSugIndex(val);
        sugIndexValue = val;
        arrownavigation = false;
    }


    return (
        <Link to={window.PATH + (data.symbol ? "/stock/" + data.symbol : "/stocks/" + data.name)} onClick={itemClick}
            onMouseOver={setActiveItem} onMouseOut={clearActiveItem} >
            <div className={"suggestion-row" + ((isActive) ? " active" : "")}>
                {data.icon &&
                    <div className="stock-img">
                        <div>
                            <img src={window.PATH + "/images/stocks/" + data.icon} />
                        </div>
                    </div>}
                <div className="stock-data">
                    <div className="stock-title">
                        <h2>{data.name}</h2>
                    </div>
                    {data.price &&
                        <div className="stock-price">${data.price}</div>}
                    {!data.price &&
                        <div className='remove-item'>
                            <i className="bi bi-x-lg"></i>
                        </div>
                    }
                </div>
            </div>
        </Link>
    );
}

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggetions] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sugIndex, setSugIndex] = useState(sugIndexValue);
    const [showSearch, setShowSearch] = useState(false);
    const [hideRecent, setHideRecent] = useState(false);
    const [reloadHistory, setReloadHistory] = useState(0);
    const [close, setClose] = useState(0);
    const inputRef = useRef(null);

    const navigate = useNavigate();
    const onQueryChange = (event) => {
        setShowSuggetions(true);
        setSugIndex(-1);
        sugIndexValue = -1;
        setSearchQuery(event.target.value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setShowSuggetions(false);
        inputRef.current.blur();
        if (searchQuery !== "") {
            let historyterm = searchQuery;
            if (sugIndexValue < 0 || sugIndexValue === sugcount || !arrownavigation) {
                navigate(window.PATH + "/stocks/" + encodeURIComponent(encodeURIComponent((searchQuery))));
            } else {
                historyterm = data[sugIndexValue].name;
                navigate(window.PATH + "/stock/" + data[sugIndexValue].symbol);
            }

            if (!searchhistory.includes(historyterm)) searchhistory.push(historyterm);
            localStorage.setItem("searchhistory", JSON.stringify(searchhistory));

            setSugIndex(-1);
            sugIndexValue = -1;
        } else {
            navigate(window.PATH + "/stocks/" + encodeURIComponent(encodeURIComponent(historyrows[sugIndexValue].name)));
            setSugIndex(-1);
            sugIndexValue = -1;
        }
    };

    useEffect(() => {
        if (searchQuery === "") {
            isrecentmode = true;
            recentMode();
        }
    }, [showSuggestions, reloadHistory]);

    useEffect(() => {
        if (searchQuery) {
            if (!hideRecent) {
                setHideRecent(true);
                isrecentmode = false;
            }
            const getSuggestions = async () => {
                setLoading(true);
                const d = await suggestion(searchQuery);
                if (!isrecentmode) {
                    if (!d.pass) {
                        sugcount = 0;
                        setData([]);
                    } else {
                        sugcount = d.data.length;
                        setData(d.data);
                    }
                }
                setLoading(false);
            }
            if (searchQuery !== "")
                getSuggestions();
            else
                setShowSuggetions(false);
        } else {
            isrecentmode = true;
            recentMode();
        }
    }, [searchQuery]);

    function recentMode() {
        historyrows = [];
        let counter = 0;
        for (const i in searchhistory) {
            if (counter < 6) {
                historyrows.push({
                    id: i,
                    name: searchhistory[searchhistory.length - i - 1]
                });
                counter++;
            }
        }
        sugcount = historyrows.length;
        setData(historyrows);
        setHideRecent(false);
    }

    const wrapperRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                closeSugg();
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
                let bottom = (hideRecent ? (sugIndexValue + 1 < sugcount + 1) : (sugIndexValue + 1 < sugcount))
                sugIndexValue = (bottom ? sugIndexValue + 1 : sugIndexValue);
                setSugIndex(sugIndexValue);
                arrownavigation = true;
                break;
            case "ArrowUp":
                e.preventDefault();
                sugIndexValue = (sugIndexValue - 1 >= 0) ? sugIndexValue - 1 : sugIndexValue;
                setSugIndex(sugIndexValue);
                arrownavigation = true;
                break;
        }
    }

    useEffect(closeSugg, [close]);

    function closeSugg() {
        setShowSuggetions(false);
        setSugIndex(-1);
        sugIndexValue = -1;
    }

    return (
        <div className="search">
            <form onSubmit={onSubmit} id="search-form">
                <div className="search-container" ref={wrapperRef}>

                    <input type="text" placeholder="Search for stock.." value={searchQuery} onChange={onQueryChange} onKeyDown={onKeyPressed}
                        onFocus={e => { e.target.select(); setShowSuggetions(true); }} ref={inputRef}
                        className={showSuggestions ? "searchinput active" : ""} />

                    {showSuggestions && <div className="search-suggestion">
                        {loading && <div id="sug-loading"></div>}
                        {!hideRecent && <div id="titlerecent">Recent Searches</div>}
                        {!hideRecent && data.length === 0 && <div id="norecent">No Recent Searches</div>}
                        {data.map((row, index) => (<Suggestion key={row.id} data={row} isActive={(index === sugIndex)}
                            setReloadHistory={setReloadHistory} setClose={setClose} setSugIndex={setSugIndex} index={index} />))}
                        {hideRecent && <div className={"suggestions-showmore" + ((sugIndex === sugcount) ? " active" : "")} onClick={onSubmit}>Show All Results</div>}
                    </div>
                    }
                </div>
                <button type="submit" onClick={() => setShowSearch(true)}><i className="bi bi-search"></i></button>
            </form>
        </div>
    )
}

const Login = ({ onLogout, isUserSignedIn, setIsUserSignedIn }) => {
    const [profile, setProfile] = useState();
    const [name, setName] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(false);

    const onLoginSuccessful = () => {
        setIsUserSignedIn(true);
        window.location.href = "";
    };

    useEffect(() => {
        async function getDetails() {
            setLoading(true);
            const d = await mydetails();
            if (d.pass) {
                setProfile(d.data[0].picture);
                setName(d.data[0].name)
                if (localStorage.getItem('myid') === null)
                    localStorage.setItem("myid", d.data[0].id);
            } else {
                if (d.msg === "AUTH_FAIL")
                    onLogout();
                if (d.error) {
                    if (!d.error.includes("NetworkError"))
                        onLogout();
                }
            }
            setLoading(false);
        }
        if (isUserSignedIn) {
            getDetails();
        }
    }, []);

    const openMenu = () => {
        setShowMenu(!showMenu);
    }

    const userRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (userRef.current && !userRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userRef]);

    const fbLogin = async (response) => {
        setLoading(true);
        const code = response.accessToken;
        if (code) {
            const loginResult = await auth({ code });
            if (loginResult.pass) {
                onLoginSuccessful();
                localStorage.setItem("token", loginResult.token);
            } else {
                alert("Unexpected error, try again later");
            }
        }
        setLoading(false);
    }


    return (
        <div className="userheader" ref={userRef}>
            {!isUserSignedIn && !loading &&
                <FacebookLogin
                    textButton={<><i className="bi bi-facebook"></i> Sign in</>}
                    appId="910446240268203"
                    callback={fbLogin}
                    cssClass="fb-login"
                />}
            {isUserSignedIn && !loading &&
                <>
                    {profile && <img src={window.API_URL + "/public/profile/" + profile} onClick={openMenu} referrerPolicy="no-referrer" />}
                    {showMenu &&
                        <div className="profile-menu">
                            <h2>Hello {name}</h2>
                            <ul>
                                <Link to={window.PATH + "/account"} onClick={() => { setShowMenu(false); }}><li><i className="bi bi-person-circle"></i> Account</li></Link>
                                <Link to={window.PATH + "/#logout"} onClick={(e) => { e.preventDefault(); setShowMenu(false); onLogout(); }}><li><i className="bi bi-box-arrow-right"></i> Logout</li></Link>
                            </ul>
                        </div>}
                </>}
            {loading && <div className='loading'></div>}
        </div>
    )
}

function Header({ onLogout, isUserSignedIn, setIsUserSignedIn }) {
    return (
        <div className="header">
            <Link to={window.PATH}>
                <div className="logo"></div>
            </Link>
            <Search />
            <Login setIsUserSignedIn={setIsUserSignedIn} isUserSignedIn={isUserSignedIn} onLogout={onLogout} />
        </div>
    );
}

export default Header;
