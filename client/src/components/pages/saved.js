import React, { useState, useEffect, useRef } from 'react'
import { StockWidget } from '../stock/widget';
import { mysaved } from '../../api';
import { JSON } from 'sequelize/types';
import { json } from 'express';

let currentdrag = 0, indexmap = [0, 1, 2, 3];
function Saved(props) {
    const { topRef } = props;
    const [data, setData] = useState(null);
    const [arr, setArr] = useState([0, 0, 0, 0]);

    const pageRef = useRef();

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
        document.getElementById("widget" + currentdrag).classList.add("over");
        /*
        if(widgetindex != currentdrag) {
            document.getElementById("widget" + widgetindex).classList.add("over");
            const dragwidth = document.getElementById("widget" + widgetindex).offsetWidth + 20;
            document.getElementById("widget" + currentdrag).style.left = (dragwidth*widgetindex)+"px";
            document.getElementById("widget" + widgetindex).style.left = (dragwidth*-1)+"px";
        }
        */
    }

    const dragover = async (e, i) => {
        e.preventDefault();
        if (i != currentdrag) {
            const boxoffset = document.getElementById("widget" + i).getBoundingClientRect().left;
            const boxwidth = document.getElementById("widget" + i).offsetWidth + 20;

            // dragged on right or left side of element
            if (e.pageX - boxoffset < boxwidth / 2) {
                //const currentoffset = document.getElementById("widget" + currentdrag).offsetWidth + 20;
                //document.getElementById("widget" + currentdrag).style.left = (currentoffset * -1) + "px";
                //document.getElementById("widget" + i).style.left = (boxwidth * (i - currentdrag)) + "px";

                //document.getElementById("dragparent").insertBefore(document.getElementById("drag" + currentdrag),document.getElementById("drag" + i));


                /*
                for (let j = indexmap[currentdrag] - 1; j >= indexmap[i]; j--) {
                    document.getElementById("dragparent").insertBefore(document.getElementById("drag" + indexmap[currentdrag]), document.getElementById("drag" + indexmap[j]));
                }

                indexmap[i] = currentdrag;
                indexmap[currentdrag] = i;
                */

                i = indexmap[i]-1;
                if (i < 0) i = 0;

                //document.getElementById("widget" + currentdrag).style.left = 0;
                //document.getElementById("widget" + i).style.left = 0;
            } else {
                //const currentoffset = document.getElementById("widget" + currentdrag).offsetWidth + 20;
                //document.getElementById("widget" + currentdrag).style.left = (boxwidth * (i - currentdrag)) + "px";
                //document.getElementById("widget" + i).style.left = (currentoffset * -1) + "px";

                /*
                console.log("INITIAL:");
                console.log(indexmap);
                console.log("J FROM " + (indexmap.indexOf(currentdrag) + 1) + " TO " + indexmap.indexOf(i));
                for (let j = indexmap.indexOf(currentdrag) + 1; j <= indexmap.indexOf(i); j++) {
                    console.log("J=" + j);
                    document.getElementById("dragparent").insertBefore(document.getElementById("drag" + indexmap[j]), document.getElementById("drag" + currentdrag));

                    const temp = indexmap[j];
                    indexmap[j] = indexmap[j - 1];
                    indexmap[j - 1] = temp;

                    await new Promise(resolve => {
                        console.log(indexmap);
                        window.requestAnimationFrame(resolve);
                    });
                }
                */

                //document.getElementById("widget" + currentdrag).style.left = 0;
                //document.getElementById("widget" + i).style.left = 0;
            }

            console.log("INITIAL:");
            console.log(indexmap);

            let from = indexmap.indexOf(currentdrag) + 1;
            let to = indexmap.indexOf(i);
            if(from > to) {
                console.log("J FROM " + (indexmap.indexOf(currentdrag) - 1) + " TO " + (indexmap.indexOf(i) + 1));

                for (let j = indexmap.indexOf(currentdrag); j >= indexmap.indexOf(i)+1; j--) {
                    console.log("J=" + j);
                    document.getElementById("dragparent").insertBefore(document.getElementById("drag" + currentdrag), document.getElementById("drag" + indexmap[j-1])); // j+1
    
                    const temp = indexmap[j];
                    indexmap[j] = indexmap[j - 1];
                    indexmap[j - 1] = temp;
    
                    await new Promise(resolve => {
                        console.log(indexmap);
                        window.requestAnimationFrame(resolve);
                    });
                }
            }else{
                console.log("J FROM " + (indexmap.indexOf(currentdrag) + 1) + " TO " + indexmap.indexOf(i));

                for (let j = indexmap.indexOf(currentdrag) + 1; j <= indexmap.indexOf(i); j++) {
                    console.log("J=" + j);
                    document.getElementById("dragparent").insertBefore(document.getElementById("drag" + indexmap[j]), document.getElementById("drag" + currentdrag));
    
                    const temp = indexmap[j];
                    indexmap[j] = indexmap[j - 1];
                    indexmap[j - 1] = temp;
    
                    await new Promise(resolve => {
                        console.log(indexmap);
                        window.requestAnimationFrame(resolve);
                    });
                }
            }



        }
    }

    const dragleave = (i) => {

        if (i != currentdrag) {

        }

        /*
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
        */
    }

    const drag = (e, i) => {
        // document.getElementById("widget" + i).style.left = 0;
        console.log(e);
    }

    const dragend = (widgetindex) => {
        document.getElementById("widget" + currentdrag).classList.remove("over");
    }

    return (
        <>
            <div className="stocks-title">
                <h2>Saved Stocks</h2>
            </div>
            <div className='row dragrow' id="dragparent" onDragOver={e => { e.preventDefault(); }}>
                {
                    arr.map((val, i) => (
                        <div className="stock-widget col-lg-3" key={"k" + i} id={"drag" + i}>
                            <div className='stock' draggable="true" id={"widget" + i}
                                onDragStart={() => { currentdrag = i; document.getElementById("widget" + currentdrag).classList.add("over"); }}
                                onDragEnter={() => { dragenter(i) }}
                                onDragLeave={() => { dragleave(i) }}
                                onDragOver={e => dragover(e, i)}
                                onDragEnd={() => { dragend(i) }}
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
