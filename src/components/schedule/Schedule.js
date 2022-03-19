import React, { useEffect, useState } from "react";
import './schedule.css';
import { binarySearch } from "../../utils";
import { default as date_module } from 'date-and-time';
import { toast } from 'react-toastify';

const loaderHTML = <div className="loader"></div>

function Schedule(props) {

    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [participants, setParticipants] = useState();
    const [update, setUpdate] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [updateID, setUpdateID] = useState();
    const [date, setDate] = useState('');
    const [st, setSt] = useState('');
    const [et, setEt] = useState('');



    function validateSubmit() {
        if (date === '') {
            toast.error('Please enter the date of the interview.');
            return;
        } if (st === '') {
            toast.error('Please enter the start time of the interview.');
            return;
        } if (et === '') {
            toast.error('Please enter the end time of the interview.');
            return;
        }
        if (selectedParticipants.length >= 2) {
            let selected_date = date_module.parse(date, 'YYYY-MM-DD');
            let selected_st = date_module.parse(st, 'h:m:s');
            let selected_et = date_module.parse(et, 'h:m:s');

            if (date_module.subtract(new Date(), selected_date).toDays() >= 0) {
                toast.error("Please don't select a past date.");
                return;
            }

            let hasCollasped = [];

            let flag = true;

            for (let i = 0; i < selectedParticipants.length; i++) {
                let itm = selectedParticipants[i];
                let check;
                if (update) {
                    check = props.isSlotsCollasping(itm, selected_date, selected_st, selected_et, true, updateID);
                } else {
                    check = props.isSlotsCollasping(itm, selected_date, selected_st, selected_et, false, -1)
                }
                if (check) {
                    hasCollasped.push(itm);
                    flag = false;
                }
            }



            if (flag) {
                let obj = {
                    interviwerID: props.adminID,
                    intervieweeID: selectedParticipants,
                    date: date,
                    startTime: st,
                    endTime: et
                }

                let frame = {};
                for (const [key, value] of Object.entries(props.navFrame)) {
                    frame[key] = false
                }
                frame.allSchedules = true;

                props.setNavFrame(frame);
                if (update) {
                    props.updateSchedule(updateID, obj);
                } else {
                    props.saveNewSchedule(obj);
                }
                props.reloadInterviews();

            } else {
                let len = hasCollasped.length % 6;
                hasCollasped.sort();
                for (let i = 0; i < participants.length && len >= 0; i++) {
                    if (binarySearch(hasCollasped, participants[i].id)) {
                        toast.error(`${participants[i].name} has an interview collasping with the selected slot`, {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            className: 'collaspe-toast'
                        });
                        len -= 1;
                    }
                }
            }
        } else {
            toast.error('Please increasee the number of participants.');
        }
    }

    function handleSubmit() {
        validateSubmit();
    }

    function addSelectedParticipant(e, id) {
        let selected = selectedParticipants.slice();

        let checkbox_status = e.target.checked;
        if (checkbox_status) {
            if (!binarySearch(selected, id)) {
                selected.push(id);
            }
        } else {
            if (binarySearch(selected, id)) {
                selected = selected.filter((itm) => {
                    if (itm !== id) {
                        return true;
                    }
                    return false;
                })
            }
        }
        selected.sort();
        setSelectedParticipants(selected);
    }

    function createListItem(item, state) {
        return (

            <tr key={item.id} className="mx-5 px-5">
                <th scope="row">{item.id}</th>
                <td>
                    {
                        state ?
                            <input checked={true} onChange={(e) => { addSelectedParticipant(e, item.id) }} type="checkbox" name="name1" />
                            :
                            <input checked={false} onChange={(e) => { addSelectedParticipant(e, item.id) }} type="checkbox" name="name1" />
                    }
                </td>
                <td>{item.name}</td>
                <td>{item.email}</td>
            </tr>

        )
    }


    useEffect(() => {

        let participants = props.getParticipants();
        setParticipants(participants);
        setLoaded(!loaded);

        if (props.onEdit) {
            let interview = props.getInterveiwWithID(props.onEditId);
            setDate(date_module.transform(interview.date, 'DD-MM-YYYY', 'YYYY-MM-DD'));
            setSt(interview.startTime);
            setEt(interview.endTime);
            setSelectedParticipants(interview.intervieweeID);
            props.setOnEdit(!props.onEdit);
            setUpdateID(props.onEditId);
            props.setOnEditId(null);
            setUpdate(true);
        }


    }, [])

    return (
        <div id="schedule-container" className="mx-5 px-5">
            <div className="inner">
                <label for="meet-date">
                    <b>Date </b></label>
                <input value={date} onChange={(e) => setDate(e.target.value)} id="meet-date" className="form-control" type={"date"} />

                <label for="meet-st"><b>Start time</b></label>
                <input value={st} onChange={(e) => setSt(e.target.value)} id="meet-st" className="form-control" type={"time"} />

                <label for="meet-et"><b>End time</b></label>
                <input value={et} onChange={(e) => setEt(e.target.value)} id="meet-et" className="form-control" type={"time"} />
                <div id="schedule-btn">
                    <button onClick={handleSubmit} className="btn btn-info bg-opacity-75">Schedule</button>
                </div>
            </div>

            <div>
                {
                    loaded ?
                        <table className="table table-info table-hover table-responsive-sm table-borderless">
                            <thead>
                                <tr>
                                    <th scope="col">Sno</th>
                                    <th scope="col">Check participant</th>
                                    <th scope="col">Name of the participant...</th>
                                    <th scope="col">Email of the participant...</th>
                                </tr>
                            </thead>
                            <tbody>
                                {participants.map(itm => {
                                    let state = false;
                                    for (let i = 0; i < selectedParticipants.length; i++) {
                                        let id = selectedParticipants[i];
                                        if (itm.id === id) {
                                            state = true;
                                            return createListItem(itm, true);
                                        }
                                    }
                                    if (state === false) {
                                        return createListItem(itm, false);
                                    }
                                })}
                            </tbody>
                        </table>
                        :
                        loaderHTML
                }
            </div>

        </div>
    );
}

export default Schedule;
