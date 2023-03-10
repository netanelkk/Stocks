import React, { useRef,useState } from 'react'
import Homepage from './components/homepage';
import Stocks from './components/homepage/stocks';
import Stock from './components/stock';
import Header from './components/header';
import Menu from './components/header/menu';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Top from './components/pages/top';
import Saved from './components/pages/saved';
import Account from './components/pages/account';
import Analyse from './components/pages/analyse';
import Error404 from './components/pages/error404';
import Footer from './components/footer';

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import './App.css';

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en);

const local = true;
if(local) {
  window.PATH = "";
  window.API_URL = "http://10.0.0.10:4100";
}else{
  window.PATH = "/sources/marketmaven";
  window.API_URL = "https://netanel.vps.webdock.cloud:4100";
}


// list of pages with hidden menu
const fullpages = ["stock","stocks","account"];

const Pages = React.memo(({isUserSignedIn}) => {
  const { pathname } = useLocation();
  const showmenu = !fullpages.includes(pathname.replace(window.PATH,'').split("/")[1]);
  const topRef = useRef();

  return (
    <div className="main" ref={topRef}>
      {showmenu ? <Menu /> : <></>}
      <div className={"page" + (showmenu ? " withmenu" : "")}>
        <Routes>
          <Route path={window.PATH + "/"} element={<Homepage />} />
          <Route path={window.PATH + "/stocks"} element={<Stocks topRef={topRef} />} >
            <Route path=":query" />
          </Route>
          <Route path={window.PATH + "/stock"} element={<Stock topRef={topRef} isUserSignedIn={isUserSignedIn} />}>
            <Route path=":symbol" />
          </Route>
          <Route path={window.PATH + "/top"} element={<Top topRef={topRef} isUserSignedIn={isUserSignedIn} />} />
          <Route path={window.PATH + "/saved"} element={<Saved topRef={topRef} isUserSignedIn={isUserSignedIn} />} />
          <Route path={window.PATH + "/account"} element={<Account topRef={topRef} isUserSignedIn={isUserSignedIn} />} />
          <Route path={window.PATH + "/analyse"} element={<Analyse topRef={topRef} isUserSignedIn={isUserSignedIn} />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
    </div>
  );
});

function App() {
  const [isUserSignedIn, setIsUserSignedIn] = useState(localStorage.getItem('token') != null);  

  const onLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("myid"); 
    setIsUserSignedIn(false);
    window.location.href = "";
  };

  return (
    <BrowserRouter>
      <Header isUserSignedIn={isUserSignedIn} onLogout={onLogout}
           setIsUserSignedIn={setIsUserSignedIn} />
      <Pages isUserSignedIn={isUserSignedIn}
           setIsUserSignedIn={setIsUserSignedIn} />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
