import React from "react";
import './navigation.css';

const active = "btn btn-outline-success active";
const nonActive = "btn btn-outline-success";


function Navigation(props) {

    function handleNavigation(e) {
        var frame = {};
        for (const [key, value] of Object.entries(props.frame)) {
            frame[key] = false
        }
        frame[e.target.name] = true;
        props.setFrame(frame);
    }

    return (
        <div id="navigation-container" className="container-fluid mx-5 px-5">
            <button name="allSchedules" onClick={handleNavigation} className={props.frame.allSchedules ? active : nonActive} >Upcoming Interviews...</button>
            <button name="allParticipants" onClick={handleNavigation} className={props.frame.allParticipants ? active : nonActive}>List of all participants...</button>
            <button name="newSchedule" onClick={handleNavigation} className={props.frame.newSchedule ? active : nonActive}>Schedule a new interview...</button>
        </div>
    );
}

export default Navigation;