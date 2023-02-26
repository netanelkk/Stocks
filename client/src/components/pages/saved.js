import React, { useState, useEffect, useRef } from 'react'
import { StockWidget } from '../stock/widget';
import { mysaved } from '../../api';

let currentdrag = 0, order = [0,1,2,3];
function Saved(props) {
    const { topRef } = props;
    const [data, setData] = useState(null);
    const [arr, setArr] = useState([0, 0, 0, 0]);
    //const [order, setOrder] = useState([0,1,2,3]);

    useEffect(() => {
        topRef.current.scrollTop = 0;
        (async () => {
            const d = await mysaved("");
            if (!d.pass) return;
            setData(d.data);
        })();
    }, []);

    //{data && data.map(stock => (<StockWidget stock={stock} key={"stock" + stock.id} />))}

    const dragenter = (widgetindex) => {
        /*
        if(widgetindex != currentdrag) {
            document.getElementById("widget" + widgetindex).classList.add("over");
            const dragwidth = document.getElementById("widget" + widgetindex).offsetWidth + 20;
            document.getElementById("widget" + currentdrag).style.left = (dragwidth*widgetindex)+"px";
            document.getElementById("widget" + widgetindex).style.left = (dragwidth*-1)+"px";
        }
        */
    }

    const dragover = (e, i) => {

        if (order[i] != currentdrag) {
            const boxoffset = document.getElementById("widget" + order[i]).getBoundingClientRect().left;
            const boxwidth = document.getElementById("widget" + order[i]).offsetWidth + 20;

                                
                    /*
                    [0,1]
                    i=1
                    order[i]=1
                    currentdrag=0

                    neworder[1] = 0
                    neworder[0] = 1
                    ------------
                    [1,0,2]
                    i=2
                    order[i]=2
                    currentdrag=1
                    */

                    /*
                    const neworder = [...order];
                    neworder[i] = currentdrag;
                    neworder[currentdrag] = order[i];
                    order = neworder;
                    */
                   
            if (e.pageX - boxoffset < boxwidth / 2) {
                // left half
            } else {
                const currentoffset = document.getElementById("widget" + currentdrag).offsetWidth + 20;
                document.getElementById("widget" + currentdrag).style.left = (boxwidth * (order[i] - currentdrag)) + "px";
                document.getElementById("widget" + order[i]).style.left = (currentoffset * -1) + "px";
            }
        }
    }

    const dragleave = (i) => {
        document.getElementById("widget" + i).classList.remove("over");

        if (order[i] != currentdrag) {
            setTimeout(() => {
                document.getElementById("dragparent").insertBefore(document.getElementById("drag" + i), document.getElementById("drag" + currentdrag));

                document.getElementById("widget" + currentdrag).classList.add("removeanimation");
                document.getElementById("widget" + currentdrag).style.left = 0;
                document.getElementById("widget" + i).classList.add("removeanimation");
                document.getElementById("widget" + i).style.left = 0;

                setTimeout(() => {
                    document.getElementById("widget" + currentdrag).classList.remove("removeanimation");
                    document.getElementById("widget" + i).classList.remove("removeanimation");
                }, 300);

            }, 300);
        }

    }

    const drop = (widgetindex) => {

    }

    return (
        <>
            <div className="stocks-title">
                <h2>Saved Stocks</h2>
            </div>
            <div className='row dragrow' id="dragparent">
                {
                    arr.map((val, i) => (
                        <div className="stock-widget col-lg-3" key={"k" + i} id={"drag" + i}>
                            <div className='stock' draggable="true" id={"widget" + i}
                                onDragStart={() => { currentdrag = i }}
                                onDragEnter={() => { dragenter(i) }}
                                onDragLeave={() => { dragleave(i) }}
                                onDragOver={e => dragover(e, i)}
                                onDrop={() => { drop(i) }}
                            >
                                {i}
                            </div>
                        </div>
                    ))
                }

            </div>
        </>
    );
}

export default Saved;
