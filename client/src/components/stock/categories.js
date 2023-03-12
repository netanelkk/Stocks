import React from 'react'
import { Link } from "react-router-dom";

const Cat = ({ filtered, filter, cat }) => {
    return (
        <span className={filtered ? (filtered.includes(cat.id) ? "active" : "") : ''}
            key={"cat" + cat.id} onClick={() => { filter(cat.id) }}>
            <i className={"bi " + cat.icon}></i>
            {cat.name}
        </span>
    )
}

function Categories(props) {
    const { categories, filtered, setFiltered } = props;

    const filter = (catid) => {
        if (filtered) {
            if (filtered.includes(catid)) {
                setFiltered(filtered.filter(item => item !== catid));
            } else {
                setFiltered(items => [catid].concat(items));
            }
        }
    }



    return (
        <div className='categories'>
            {categories &&
                categories.map(cat => (
                    filtered ? 
                        <Cat cat={cat} filter={filter} filtered={filtered} /> 
                    : <Link to={window.PATH + "/stocks?cat=" + cat.id}><Cat cat={cat} filter={filter} filtered={filtered} /></Link>
                    )
                )
            }

            {!categories &&
                <>
                    <span className='catloading'>
                    </span>
                    <span className='catloading'>
                    </span>
                    <span className='catloading'>
                    </span>
                </>
            }
        </div>
    )
};

export default Categories;