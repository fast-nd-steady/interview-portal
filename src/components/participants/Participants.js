import React, { useEffect, useState } from "react";
import './participants.css';

function createTableRow(data) {
    return (

        <tr key={data.id}>
            <th scope="row">{data.id}</th>
            <td><i>{data.name}</i></td>
            <td><i>{data.email}</i></td>
        </tr>

    )
}

function diaplayData(data) {
    let container =
        <div className="mx-5">
            <table className="table table-success table-hover table-borderless table-responsive-sm table-striped">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">SNo </th>
                        <th scope="col">Name of the candidate</th>
                        <th scope="col">Contact email of the candidate</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(itm => {
                        return createTableRow(itm);
                    })}
                </tbody>
            </table>
        </div>

    return container;
}

const loaderHTML = <div id="loader"></div>

function Participants(props) {


    const [dataLoaded, setDataLoaded] = useState(false);
    const [displayData, setDisplayData] = useState();


    useEffect(() => {
        let data = props.getParticipants();
        setDisplayData(data);
        setDataLoaded(!dataLoaded);
    }, [])

    return (
        <div id="participant-list-container">
            {dataLoaded ?
                diaplayData(displayData)
                :
                loaderHTML
            }
        </div>
    );
}

export default Participants;