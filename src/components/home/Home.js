import React, { useEffect, useState } from "react";
import date from 'date-and-time';
import './home.css';

function handleEdit(id, props) {

    var frame = {};
    for (const [key, value] of Object.entries(props.navFrame)) {
        frame[key] = false
    }
    frame.newSchedule = true;
    props.setNavFrame(frame);


    props.setOnEditId(id);
    props.setOnEdit(true);
}

function createCard(interview, props) {

    const pattern = date.compile('ddd, MMM DD');
    const time_pattern = date.compile('hh:mm A');

    let d = date.parse(interview.date, 'DD-MM-YYYY');
    let date_string = date.format(d, pattern);

    let st = date.parse(interview.startTime, 'h:m:s');
    let st_string = date.format(st, time_pattern);

    let et = date.parse(interview.endTime, 'h:m:s');
    let et_string = date.format(et, time_pattern);

    return (
        <div key={interview.id} className="card w-50">
            <div className="card-body bg-opacity-25 bg-primary">
                <h5 className="card-title">{date_string}</h5>
                <p className="card-text"><i>{st_string} - {et_string}</i></p>
            </div>
            <div className="card-footer bg-opacity-25 bg-warning">
                <button onClick={(e) => {
                    handleEdit(interview.id, props)
                }} className="btn btn-danger opacity-75"><strong><i>Edit</i></strong></button>
            </div>
        </div>
    )
}


function Home(props) {
    return (
        <div id="home-container" className="mx-5 px-5">
            <div className="card-columns">
                {props.scheduledInterviews.map((itm) => { return createCard(itm, props) })}
            </div>
        </div>
    );
}

export default Home;