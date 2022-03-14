import moment                  from "moment";
import { FormEvent, useState } from "react";
import ReactLoading            from 'react-loading';
import { useNavigate }         from "react-router-dom";
import Select                  from "react-select";
import makeAnimated            from "react-select/animated";
import useFetch                from "../Hooks/useFetch";
import './scheduleInterview.css';
import { IParticipant }                   from "../Models/IParticipants";
import { getInterviews, getParticipants } from "../Utils/ApiHandler";

const ScheduleInterview = () => {
    const {
              data: candidateData,
              isPending: isCandidateDataPending,
              error: candidateDataError,
          } = useFetch(`${getParticipants}`);
    
    const {
              data: interviewerData,
              isPending: isInterviewerDataPending,
              error: interviewerDataError,
          } = useFetch(`${getInterviews}`);
    
    const animatedComponents = makeAnimated();
    const [date, setDate] = useState<any>(new Date());
    const [startTime, setStartTime] = useState<any>(new Date());
    const [endTime, setEndTime] = useState<any>(new Date());
    const [candidates, setCandidates] = useState<IParticipant[]>([]);
    const [interviewers, setInterviewers] = useState<IParticipant[]>([]);
    const [isPending, setIsPending] = useState(false);
    const history = useNavigate();
    
    const getOptions = ( data: any ) => {
        console.log(data);
        const options = [];
        for (let d of data) {
            options.push({ label: d.name, value: d.email });
        }
        return options;
    };
    
    const handleSubmit = ( e: FormEvent<HTMLFormElement> ) => {
        setIsPending(true);
        e.preventDefault();
        const participants = [];
        for (let interviewer of interviewers) {
            participants.push(interviewer);
        }
        for (let candidate of candidates) {
            participants.push(candidate);
        }
        const stime = moment(
            `${date} ${startTime}`,
            "YYYY-MM-DD HH:mm:ss"
        ).format();
        const etime = moment(`${date} ${endTime}`, "YYYY-MM-DD HH:mm:ss").format();
        
        const interview = {
            startDateTime: stime,
            endDateTime: etime,
            participants: participants,
        };
        console.log(interview);
        
        fetch(`${getInterviews}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(interview),
        })
            .then(( res ) => {
                if(res.ok) {
                    return res.json();
                }
                return res.text().then(( text ) => {
                    throw new Error(text);
                });
            })
            .then(( data ) => {
                console.log(data);
                setIsPending(false);
                console.log("Successfully added interview");
                alert(
                    "Successfully scheduled interview! and email notification is sent."
                );
                history("/");
            })
            .catch(( err ) => {
                const data = JSON.parse(err.message);
                alert(data.message);
                setIsPending(false);
                console.log(err);
            });
    };
    
    return (
        <div className="create">
            <h1>Schedule a new interview</h1>
            <br/>
            {( candidateDataError || interviewerDataError ) && (
                <h2>Unable to fetch participants information</h2>
            )}
            {( isCandidateDataPending || isInterviewerDataPending ) && (
                <ReactLoading type={"spin"} className={'loading'} color={'#ECECEC'}/>
            )}
            {candidateData && interviewerData && (
                <form onSubmit={handleSubmit}>
                    <label>Choose Date : </label>
                    <input
                        type="date"
                        required
                        value={date.toDateString()}
                        onChange={( e ) => setDate(e.target.value)}
                    />
                    <label>Start Time : </label>
                    <input
                        type="time"
                        value={startTime.toDateString()}
                        required
                        onChange={( e ) => setStartTime(e.target.value)}
                    />
                    <label>End Time : </label>
                    <input
                        type="time"
                        value={endTime.toDateString()}
                        required
                        onChange={( e ) => setEndTime(e.target.value)}
                    />
                    <label>Select Candidates : </label>
                    <Select
                        isMulti
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        name="candidates"
                        options={getOptions(candidateData)}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={( selectedOption ) => {
                            // @ts-ignore
                            setCandidates([...candidates,{ name:selectedOption.label.toString(), email:selectedOption.value.toString(),type:"Candidate "}]);
                            console.log("candidates selected", selectedOption);
                        }}
                    />
                    <label>Select Interviewers : </label>
                    <Select
                        isMulti
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        name="interviewers"
                        options={getOptions(interviewerData)}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={( selectedOption ) => {
                            // @ts-ignore
                            setInterviewers([...interviewers,{ name:selectedOption.label.toString(), email:selectedOption.value.toString(),type:"Interviewer"}]);
                            console.log("interviewers selected", selectedOption);
                        }}
                    />
                    {!isPending && <button>Schedule Interview</button>}
                    {isPending && <>
                        <ReactLoading type={"spin"} color={'#ECECEC'}/>
                        <button disabled>Adding Interview...</button>
                    </>}
                </form>
            )}
        </div>
    );
};

export default ScheduleInterview;