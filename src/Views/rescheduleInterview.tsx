import moment                     from "moment";
import { FormEvent, useState }    from "react";
import ReactLoading               from "react-loading";
import Moment                     from "react-moment";
import { useNavigate, useParams } from "react-router-dom";
import Select                     from "react-select";
import makeAnimated               from "react-select/animated";
import useFetch                   from "../Hooks/useFetch";
import './rescheduleInterview.css';
import { getInterviews, getParticipants, putInterviews } from "../Utils/ApiHandler";

const RescheduleInterview = () => {
    const { id } = useParams();
    const {
              data: candidateData,
              isPending: isCandidateDataPending,
              error: candidateDataError,
          } = useFetch(getParticipants);
    
    const {
              data: interviewerData,
              isPending: isInterviewerDataPending,
              error: interviewerDataError,
          } = useFetch(getParticipants);
    
    const {
              data: interviewData,
              isPending: isInterviewDataPending,
              error: interviewDataError,
          } = useFetch(`${getInterviews}${id}`);
    
    const animatedComponents = makeAnimated();
    const [date, setDate] = useState<any>(new Date());
    const [startDateTime, setStartDateTime] = useState<any>(new Date());
    const [endDateTime, setEndDateTime] = useState<any>(new Date());
    const [candidates, setCandidates] = useState<any>([]);
    const [interviewers, setInterviewers] = useState<any>([]);
    const [isPending, setIsPending] = useState<boolean>(false);
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
            // @ts-ignore
            participants.push(interviewer.value);
        }
        for (let candidate of candidates) {
            // @ts-ignore
            participants.push(candidate.value);
        }
        const stime = moment(
            `${date} ${startDateTime}`,
            "YYYY-MM-DD HH:mm:ss"
        ).format();
        const etime = moment(`${date} ${endDateTime}`, "YYYY-MM-DD HH:mm:ss").format();
        console.log("this is parti", participants);
        const interview = {
            startDateTime: stime,
            endDateTime: etime,
            participants: participants,
        };
        console.log(interview);
        
        fetch(`${putInterviews}/${id}`, {
            method: "PUT",
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
                console.log("Successfully updated interview");
                alert(
                    "Successfully Rescheduled Interview and email notifications are sent!"
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
            <h1>Reschedule interview</h1>
            <h2>id: {id}</h2>
            {( candidateDataError || interviewerDataError || interviewDataError ) && (
                <div>{"Unable to fetch participants information"}</div>
            )}
            {( isCandidateDataPending ||
                isInterviewerDataPending ||
                isInterviewDataPending ) && <ReactLoading type={"spin"} className={'loading'} color={'#ECECEC'}/>}
            {candidateData && interviewerData && interviewData && (
                <div>
                    <div className="old-details">
                        <h3>Previous Details</h3>
                        <h4>
                            Date:{" "}
                            <Moment format="DD-MM-YYYY">{
                                // @ts-ignore
                                interviewData.startDateTime}</Moment>
                        </h4>
                        <h4>
                            Timings:{" "}
                            <Moment format="hh:mm A">{
                                // @ts-ignore
                                interviewData.startDateTime}</Moment> -{" "}
                            <Moment format="hh:mm A">{
                                // @ts-ignore
                                interviewData.endDateTime}</Moment>
                        </h4>
                        <h4>Participants</h4>
                        <ul>
                            {
                                // @ts-ignore
                                interviewData.participants.map(( participant, idx ) => (
                                    <li>{participant.email}</li>
                                ))}
                        </ul>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <label>Reschedule Date : </label>
                        <input
                            type="date"
                            required
                            value={date.toDateString()}
                            onChange={( e ) => setDate(e.target.value)}
                        />
                        <label>Reschedule Start Time : </label>
                        <input
                            type="time"
                            value={startDateTime.toDateString()}
                            required
                            onChange={( e ) => setStartDateTime(e.target.value)}
                        />
                        <label>Rescheudle End Time : </label>
                        <input
                            type="time"
                            value={endDateTime.toDateString()}
                            required
                            onChange={( e ) => setEndDateTime(e.target.value)}
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
                                setCandidates(selectedOption);
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
                                setInterviewers(selectedOption);
                                console.log("interviewers selected", selectedOption);
                            }}
                        />
                        {!isPending && <button>Rechedule Interview</button>}
                        {isPending && <button disabled>Rescheduling Interview...</button>}
                    </form>
                </div>
            )}
        </div>
    );
};

export default RescheduleInterview;