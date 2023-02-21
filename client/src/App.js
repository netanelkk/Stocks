import React, {  useRef } from 'react'
import Homepage from './components/homepage';
import Stocks from './components/homepage/stocks';
import Stock from './components/stock';
import Header from './components/header';
import Menu from './components/header/menu';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import './App.css';

window.PATH = "";

// list of pages with hidden menu
const fullpages = ["stock"];

const Pages = React.memo(() => {
  const { pathname } = useLocation();
  const showmenu = !fullpages.includes(pathname.split("/")[1]);
  const topRef = useRef();

  return (
    <div className="main" ref={topRef}>
      {showmenu ? <Menu /> : <></>}
      <div className={"page" + (showmenu ? " withmenu" : "")}>
        <Routes>
          <Route path={window.PATH + "/"} element={<Homepage />} />
          <Route path={window.PATH + "/stocks"} element={<Stocks />} />
          <Route path={window.PATH + "/stock"} element={<Stock topRef={topRef} />}>
            <Route path=":symbol" />
          </Route>
        </Routes>
      </div>
    </div>
  );
});

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Pages />
    </BrowserRouter>
  );
}

export default App;
