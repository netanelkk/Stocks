import React, { useState, useEffect, forwardRef, useRef } from 'react'
import { StockWidget } from '../stock/widget';
import { fetchAll } from '../../api';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Filters = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [showCatMenu, setShowCatMenu] = useState(false);
    const [showByMenu, setShowByMenu] = useState(false);

    const DateButton = forwardRef(({ value, onClick }, ref) => (
        <div className='pick pick-date' onClick={onClick} ref={ref}>
            <i className="bi bi-calendar-day"></i>
            <span>{value}</span>
        </div>
    ));

    const openCatMenu = () => {
        setShowCatMenu(!showCatMenu);
    }
    const openByMenu = () => {
        setShowByMenu(!showByMenu);
    }

    const catRef = useRef(null);
    const byRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (catRef.current && !catRef.current.contains(event.target)) {
                setShowCatMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [catRef]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (byRef.current && !byRef.current.contains(event.target)) {
                setShowByMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [byRef]);

    return (
        <>
            <div className='top-filters'>
                <div className='filter-container'>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        customInput={<DateButton />}
                        calendarClassName="datepicker"
                        todayButton="Today"
                        dateFormat="dd/MM/yyyy"
                    />
                </div>
                <div className='filter-container' ref={catRef}>
                    <div className='pick pick-cat' onClick={openCatMenu}>
                        <i className="bi bi-check2-square"></i>
                        <span>All Categories</span>
                    </div>
                    <div className={'cat-menu' + (!showCatMenu ? ' hide' : '')}>
                        <label className='custom-option' htmlFor="cat1">
                            <input type="checkbox" id="cat1" />
                            <span className="checkmark"></span>
                            <span>Technology</span>
                        </label>
                        <label className='custom-option' htmlFor="cat2">
                            <input type="checkbox" id="cat2" />
                            <span className="checkmark"></span>
                            <span>Technology</span>
                        </label>
                        <label className='custom-option' htmlFor="cat3">
                            <input type="checkbox" id="cat3" />
                            <span className="checkmark"></span>
                            <span>Technology</span>
                        </label>
                    </div>
                </div>
                <div className='filter-container' ref={byRef}>
                    <div className='pick pick-by' onClick={openByMenu}>
                        <i className="bi bi-percent"></i>
                        <span>By Percentage</span>
                    </div>
                    <div className={'cat-menu' + (!showByMenu ? ' hide' : '')}>
                        <ul>
                            <li><i className="bi bi-percent"></i> By Percentage</li>
                            <li><i className="bi bi-plus-slash-minus"></i> By Price Difference</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

function Top(props) {
    const { topRef } = props;
    const [topPercentage, setTopPercentage] = useState(null);
    const [lowPercentage, setLowPercentage] = useState(null);
    const [topDifference, setTopDifference] = useState(null);
    const [lowDifference, setLowDifference] = useState(null);

    useEffect(() => {
        topRef.current.scrollTop = 0;
        (async () => {
            const d = await fetchAll("");
            if (!d.pass) throw new Error(d.msg);
            console.log(d.data);
            let data = d.data;
            data.sort((a, b) => { return b.stock_difference_percentage - a.stock_difference_percentage });
            setTopPercentage(data.slice(0, 5));

            data.sort((a, b) => { return a.stock_difference_percentage - b.stock_difference_percentage });
            setLowPercentage(data.slice(0, 5));

            data.sort((a, b) => { return b.stock_difference - a.stock_difference });
            setTopDifference(data.slice(0, 5));

            data.sort((a, b) => { return a.stock_difference - b.stock_difference });
            setLowDifference(data.slice(0, 5));
        })();
    }, []);

    return (
        <>
            <div className="stocks-title">
                <h2>Top Movers</h2>
            </div>

            <Filters />

            <div className="top-row">
                <div className="row-column">
                    <div className="top-title">
                        <i className="bi bi-arrow-up-circle-fill"></i>
                        <div>Percentage</div>
                    </div>
                    {topPercentage && topPercentage.map((stock, i) => (<StockWidget i={i} stock={stock} key={"stock" + stock.id} isColumn={true} />))}
                    {!topPercentage && <div className='loading-large' style={{ height: "400px" }}></div>}
                </div>
                <div className="row-column">
                    <div className="top-title">
                        <i className="bi bi-arrow-down-circle-fill"></i>
                        <div>Percentage</div>
                    </div>
                    {lowPercentage && lowPercentage.map((stock, i) => (<StockWidget i={i} stock={stock} key={"stock" + stock.id} isColumn={true} />))}
                    {!lowPercentage && <div className='loading-large' style={{ height: "400px" }}></div>}
                </div>
            </div>

            <div className="top-row">
                <div className="row-column">
                    <div className="top-title">
                        <i className="bi bi-arrow-up-circle-fill"></i>
                        <div>Price Difference</div>
                    </div>
                    {topDifference && topDifference.map((stock, i) => (<StockWidget i={i} stock={stock} key={"stock" + stock.id} isColumn={true} />))}
                    {!topDifference && <div className='loading-large' style={{ height: "400px" }}></div>}
                </div>
                <div className="row-column">
                    <div className="top-title">
                        <i className="bi bi-arrow-down-circle-fill"></i>
                        <div>Price Difference</div>
                    </div>
                    {lowDifference && lowDifference.map((stock, i) => (<StockWidget i={i} stock={stock} key={"stock" + stock.id} isColumn={true} />))}
                    {!lowDifference && <div className='loading-large' style={{ height: "400px" }}></div>}
                </div>
            </div>
        </>
    );
}

export default Top;
