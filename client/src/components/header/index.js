import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { suggestion, auth, mydetails } from '../../api';
import { useGoogleLogin } from '@react-oauth/google';

const Suggestion = ({ data, isActive }) => {
    return (
        <Link to={window.PATH + "/stock/" + data.symbol}>
            <div className={"suggestion-row" + ((isActive) ? " active" : "")}>
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

var sugIndexValue = -1, sugcount = 0;
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
        setSugIndex(-1);
        sugIndexValue = -1;
        setSearchQuery(event.target.value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (searchQuery !== "") {
            setShowSuggetions(false);
            inputRef.current.blur();
            if (sugIndexValue < 0 || sugIndexValue === sugcount) {
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
                sugcount = 0;
                setData([]);
            } else {
                sugcount = d.data.length;
                setData(d.data);
            }
            setLoading(false);
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
                sugIndexValue = (sugIndexValue + 1 < sugcount + 1) ? sugIndexValue + 1 : sugIndexValue;
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
                        <div className={"suggestions-showmore" + ((sugIndex === sugcount) ? " active" : "")} onClick={onSubmit}>Show All Results</div>
                    </div>
                    }
                </div>
                <button type="submit" onClick={() => setShowSearch(true)}><i className="bi bi-search"></i></button>
            </form>
        </div>
    )
}

const Login = ({ onLogout, isUserSignedIn, setIsUserSignedIn }) => {
    const [profile, setProfile] = useState("https://cdn4.buysellads.net/uu/1/127419/1670532337-Stock2.jpg");
    const [showMenu, setShowMenu] = useState(false);

    const onLoginSuccessful = () => {
        setIsUserSignedIn(true);
        window.location.href = "";
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async ({ code }) => {
            const loginResult = await auth({ code });
            if (loginResult.pass) {
                onLoginSuccessful();
                localStorage.setItem("token", loginResult.token);
            } else {
                alert("Unexpected error, try again later");
            }
        },
        flow: 'auth-code'
    });

    useEffect(() => {
        async function getDetails() {
            const d = await mydetails();
            if (d.pass) {
                console.log(d);
                setProfile(d.data[0].picture);
            } else {
                if (d.msg === "AUTH_FAIL")
                    onLogout();
                if (d.error) {
                    if (!d.error.includes("NetworkError"))
                        onLogout();
                }
            }
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

    return (
        <div className="userheader" ref={userRef}>
            {!isUserSignedIn &&
                <button onClick={() => googleLogin()}><i className="bi bi-google"></i> Sign in</button>
            }
            {isUserSignedIn &&
                <>
                    <img src={profile} onClick={openMenu} />
                    {showMenu && 
                    <div className="profile-menu">
                        <ul>
                            <Link to={window.PATH + "/settings"} onClick={() => { setShowMenu(false); }}><li><i className="bi bi-gear"></i> Settings</li></Link>
                            <Link to={window.PATH + "/#logout"} onClick={(e) => { e.preventDefault(); setShowMenu(false); onLogout(); }}><li><i className="bi bi-box-arrow-right"></i> Logout</li></Link>
                        </ul>
                    </div> }
                </>}
        </div>
    )
}

function Header({ onLogout, isUserSignedIn, setIsUserSignedIn }) {
    return (
        <div className="header">
            <Link to={window.PATH}>
                <div className="logo">
                    <i className="bi bi-graph-up"></i> Stocks
                </div>
            </Link>
            <Search />
            <Login setIsUserSignedIn={setIsUserSignedIn} isUserSignedIn={isUserSignedIn} onLogout={onLogout} />
        </div>
    );
}

export default Header;
