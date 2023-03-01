import React, { useState, useEffect, useRef } from 'react'
import { mydetails,deleteaccount } from '../../api';

function Account(props) {
    const { topRef } = props;
    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => {
            const d = await mydetails();
            if (!d.pass) return;
            setData(d.data[0]);
        })();

        topRef.current.scrollTop = 0;
    }, []);

    const deleteClick = async () => {
        if(window.confirm("Are you sure? All data will be deleted")) {
            const d = await deleteaccount();
            if(d.pass)
                window.location.href = window.PATH+"/";
        }
    }

    return (
        <div className='accountpage'>
            {data &&
                <div className='userbox'>
                    <img src={data.picture} />
                    <div id="boxname">{data.name}</div>
                    <div id="boxemail">{data.email}</div>
                    <div id="boxdate">Joined at {data.registerdate.match(/\d{4}-\d{2}-\d{2}/)}</div>
                    <button onClick={deleteClick}><i className="bi bi-person-x"></i> Delete Account</button>
                </div>}
        </div>
    );
}

export default Account;
