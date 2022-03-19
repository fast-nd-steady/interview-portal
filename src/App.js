import React, { useEffect, useState } from 'react';

import Home from './components/home/Home.js';
import Schedule from './components/schedule/Schedule.js';
import Header from './components/header/Header.js';
import Navigation from './components/navigation/Navigation.js';
import Participants from './components/participants/Participants.js';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


import {
    binarySearch,
    isSlotOverlap,
    updateSchedule,
    getAdminDetails,
    getParticipants,
    saveNewSchedule,
    getAllInterviews,
    isSlotsCollasping,
    getInterveiwWithID,
    getScheduledInterviews,
} from './utils.js';

import data from './data.js';


let adminID = 1;
var loaderHtml = (<div id="loader"></div>);

function App() {

    const [detailLoader, setDetailLoader] = useState(true);
    const [interviewCardLoader, setInterviewCardLoader] = useState(true);
    const [adminDetails, setAdminDetails] = useState();
    const [scheduledInterviews, setScheduledInterviews] = useState();
    const [navFrame, setNavFrame] = useState({
        addParticipant: false,
        newSchedule: false,
        allSchedules: true,
        allParticipants: false
    })
    const [onEdit, setOnEdit] = useState();
    const [onEditId, setOnEditId] = useState();

    function reloadInterviews() {
        let interviews = getScheduledInterviews(adminID);
        setScheduledInterviews(interviews);
    }
    useEffect(() => {
        if (localStorage.getItem('interview') === null) {
            localStorage.setItem('interview', JSON.stringify(data.interview))
        }
        if (localStorage.getItem('admin') === null) {
            localStorage.setItem('admin', JSON.stringify(data.admin))
        }
        if (localStorage.getItem('participant') === null) {
            localStorage.setItem('participant', JSON.stringify(data.participant))
        }
        if (localStorage.getItem('resume') === null) {
            localStorage.setItem('resume', JSON.stringify(data.resume))
        }

        let details = getAdminDetails(adminID);
        setAdminDetails(details);
        setDetailLoader(!detailLoader);

        let interviews = getScheduledInterviews(adminID);
        setScheduledInterviews(interviews);
        setInterviewCardLoader(!interviewCardLoader);


    }, []);

    return (
        <div className='App'>
            {detailLoader ? loaderHtml : <Header adminName={adminDetails.name} />}

            {detailLoader ? <div></div> : <Navigation frame={navFrame} setFrame={setNavFrame} />}

            {interviewCardLoader ?
                loaderHtml
                :
                navFrame.allSchedules ?
                    <Home
                        setOnEdit={setOnEdit}
                        setOnEditId={setOnEditId}
                        navFrame={navFrame}
                        setNavFrame={setNavFrame}
                        scheduledInterviews={scheduledInterviews}
                    />
                    :
                    null
            }

            {navFrame.allParticipants ?
                <Participants getParticipants={getParticipants} />
                :
                null
            }

            {navFrame.newSchedule ?
                <Schedule
                    onEdit={onEdit}
                    adminID={adminID}
                    onEditId={onEditId}
                    navFrame={navFrame}
                    setOnEdit={setOnEdit}
                    setOnEditId={setOnEditId}
                    setNavFrame={setNavFrame}
                    binarySearch={binarySearch}
                    isSlotOverlap={isSlotOverlap}
                    updateSchedule={updateSchedule}
                    getParticipants={getParticipants}
                    saveNewSchedule={saveNewSchedule}
                    reloadInterviews={reloadInterviews}
                    getAllInterviews={getAllInterviews}
                    isSlotsCollasping={isSlotsCollasping}
                    getInterveiwWithID={getInterveiwWithID}
                />
                :
                null
            }
            <ToastContainer />
        </div>
    );
}

export default App;