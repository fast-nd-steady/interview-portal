import { default as date_module } from 'date-and-time';
import emailjs from '@emailjs/browser';
import { init } from '@emailjs/browser';
init("TCpbgb_aafDno8-6q");

function getAdminDetails(id) {
    let data = JSON.parse(localStorage.getItem('admin'));
    let admin;
    data.forEach(itm => {
        if (itm.id === id) {
            admin = itm;
            return;
        }
    })
    return admin;
}

function getParticipants() {
    let data = JSON.parse(localStorage.getItem('participant'));
    return data;
}

function getAllInterviews() {
    let data = JSON.parse(localStorage.getItem('interview'));
    return data;
}

function binarySearch(arr, x) {
    let start = 0, end = arr.length - 1;
    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        if (arr[mid] === x) return true;
        else if (arr[mid] < x)
            start = mid + 1;
        else
            end = mid - 1;
    }
    return false;
}

function getScheduledInterviews(id) {
    let data = getAdminDetails(id);
    let interviews = data.interviewID;
    interviews.sort();

    let interviewObjs = JSON.parse(localStorage.getItem('interview'));
    interviewObjs.filter(itm => binarySearch(interviews, itm.id));
    return interviewObjs;
}

function isSlotOverlap(st1, st2, et1, et2) {
    let s1, s2, e1, e2;
    s1 = parseInt(date_module.format(st1, 'HH')) + (parseInt(date_module.format(st1, 'mm'))) / 60;
    s2 = parseInt(date_module.format(st2, 'HH')) + (parseInt(date_module.format(st2, 'mm'))) / 60;
    e1 = parseInt(date_module.format(et1, 'HH')) + (parseInt(date_module.format(et1, 'mm'))) / 60;
    e2 = parseInt(date_module.format(et2, 'HH')) + (parseInt(date_module.format(et2, 'mm'))) / 60;

    return (
        (s1 === s2 && e1 === e2)
        ||
        (s1 >= s2 && e1 <= e2)
        ||
        (s1 <= s2 && e1 >= e2)
        ||
        (s1 >= s2 && s1 < e2)
        ||
        (e1 > s1 && e1 <= e2)
    )
}

function getInterveiwWithID(id) {
    let interviews = JSON.parse(localStorage.getItem('interview'));
    for (let i = 0; i < interviews.length; i++) {
        let itm = interviews[i];
        if (itm.id === id) return itm;
    }
}

function getPatricipantWithID(id) {
    let participant = JSON.parse(localStorage.getItem('participant'));
    for (let i = 0; i < participant.length; i++) {
        let itm = participant[i];
        if (itm.id === id) return itm;
    }
}

function isSlotsCollasping(id, date, st, et, update, updateID) {
    let ids = getPatricipantWithID(id);
    for (let i = 0; i < ids.interviewID.length; i++) {
        let id = ids.interviewID[i];

        if (update) {
            if (updateID === id) return false;
        }

        let itm = getInterveiwWithID(id);
        let itm_date = date_module.parse(itm.date, 'DD-MM-YYYY');
        let itm_st = date_module.parse(itm.startTime, 'h:m:s');
        let itm_et = date_module.parse(itm.endTime, 'h:m:s');
        if (date_module.isSameDay(date, itm_date)) {
            if (isSlotOverlap(st, itm_st, et, itm_et)) {
                return true;
            } else {
                return false;
            }
        }
    }
}

function sendMail(mail, date, st, et) {
    console.log(mail, date, st, et);
    let form = {
        to: mail,
        date: date,
        st: st,
        et: et,
        email: 'yash.ag.bu@gmail.com'
    }

    emailjs.send('service_6tbn2t2', 'template_34gg33n', form)
        .then(function (response) {
            console.log('SUCCESS!', response.status, response.text);
        }, function (error) {
            console.log('FAILED...', error);
        });
}

function getEmail(obj) {
    let participant = getParticipants();
    let selected = obj.intervieweeID;
    let emails = []
    participant.map(itm => {
        for (let i = 0; i < selected.length; i++) {
            if (itm.id === selected[i]) {
                return emails.push(itm.email);
            }

        }
        return null;
    })

    emails.forEach(itm => {
        setTimeout(() => {
            sendMail(itm, obj.date, obj.startTime, obj.endTime);
        }, 1500)
    })
}

function saveNewSchedule(obj) {
    let interviews = getAllInterviews()
    obj.id = interviews.length + 1;
    obj.date = date_module.transform(obj.date, 'YYYY-MM-DD', 'DD-MM-YYYY');
    interviews.push(obj);
    localStorage.setItem('interview', JSON.stringify(interviews));
    getEmail(obj);
}

function updateSchedule(updateID, obj) {
    let interviews = getAllInterviews();
    obj.id = updateID;
    obj.date = date_module.transform(obj.date, 'YYYY-MM-DD', 'DD-MM-YYYY');
    for (let i = 0; i < interviews.length; i++) {
        let id = interviews[i].id;
        if (id === updateID) {
            interviews[i] = obj;
            break;
        }
    }
    localStorage.setItem('interview', JSON.stringify(interviews));
}

export {
    binarySearch,
    isSlotOverlap,
    updateSchedule,
    getParticipants,
    saveNewSchedule,
    getAdminDetails,
    getAllInterviews,
    isSlotsCollasping,
    getInterveiwWithID,
    getScheduledInterviews,
}