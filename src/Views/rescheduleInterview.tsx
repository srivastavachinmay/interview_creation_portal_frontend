import { FormEvent, useEffect, useState } from "react";
import DateTimePicker                     from "react-datetime-picker";
import ReactLoading                       from "react-loading";
import Moment                             from "react-moment";
import { useNavigate, useParams }         from "react-router-dom";
import Select                             from "react-select";
import makeAnimated                       from "react-select/animated";
import { getInterviewsById }              from "../Axios/Interviews";
import { getParticipant }                 from "../Axios/Participants";
import { IInterview }                     from "../Models/IInterview";
import { IParticipant }                   from "../Models/IParticipants";
import { PUT_INTERVIEW }                  from "../Utils/ApiHandler";
import './rescheduleInterview.css';

const RescheduleInterview = () => {
    const { id } = useParams();
    const [candidateData, setCandidateData] = useState<IParticipant[]>([]);
    const [interviewerData, setInterviewerData] = useState<IParticipant[]>([]);
    const [interviewData,setInterviewData] = useState<IInterview>();
    const [error,setError] = useState<any>();
    useEffect(() => {
        ( async () => {
            const data = await getParticipant();
            const idata = await getInterviewsById(Number(id))
            if(!data) {
                // TODO: SHOW ERROR
                setError("No data")
                throw new Error("No Data")
            }
            if(!idata)
            {
                setError("No Data")
                throw new Error("No Data")
            }
            
            setInterviewerData(data.filter(( d ) => d.type === 'Interviewer'));
            setCandidateData(data.filter(( d ) => d.type === 'Candidate'));
            setInterviewData(idata)
            console.log("candidate data");
            console.log(data);
            console.log(candidateData);
            console.log(interviewerData);
            
        } )();
        
    }, []);
   
    const animatedComponents = makeAnimated();
    const [startDateTime, setStartDateTime] = useState<any>(new Date());
    const [endDateTime, setEndDateTime] = useState<any>(new Date());
    const [candidates, setCandidates] = useState<String[]>([]);
    const [interviewers, setInterviewers] = useState<String[]>([]);
    const [isPending, setIsPending] = useState<boolean>(false);
    const history = useNavigate();
    
    const getOptions = ( data: any ) => {
        if(data) {
            const options = [];
            for (let d of data) {
                options.push({ label: d.name, value: d.email });
            }
            return options;
        }
        return [{ name: "chinmay", value: "chinmay" }];
    };
    
    const handleSubmit = ( e: FormEvent<HTMLFormElement> ) => {
        setIsPending(true);
        e.preventDefault();
        
        
        const interview = {
            id:Number(id),
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            participants: [...interviewers, ...candidates],
        };
        // console.log(interview);
        
        fetch(`${PUT_INTERVIEW}`, {
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
        <div className="creates">
            <h1>Reschedule interview</h1>
            <h2>id: {id}</h2>
            {( error ) && (
                <div>{"Unable to fetch participants information"}</div>
            )}
            {( isPending ) && <ReactLoading type={"spin"} className={'loading'} color={'#ECECEC'}/>}
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
        
                        <label>Reschedule Start Time :</label>
                        <DateTimePicker minDate={new Date()} onChange={setStartDateTime}
                                        value={startDateTime}/>
                        <label>Reschedule End Time : </label>
                        <DateTimePicker minDate={startDateTime} onChange={setEndDateTime}
                                        value={endDateTime}/>
                        <label>Select Candidates : </label>
                        <Select
                            isMulti
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            name="candidates"
                            options={getOptions(candidateData)}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={( selectedOption: any ) => {
                                // @ts-ignore
                                setCandidates(selectedOption.map(f => f.value));
                                console.log("candidates selected", candidates);
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
                            onChange={( selectedOption: any ) => {
                                // @ts-ignore
                                setInterviewers(selectedOption.map(f => f.value));
                            }}
                        />
                        {!isPending && <button type={"submit"}>Schedule Interview</button>}
                        {isPending && <>
                            <ReactLoading type={"spin"} color={'#ECECEC'}/>
                            <button disabled>Adding Interview...</button>
                        </>}
                    </form>
                </div>
            )}
        </div>
    );
};

export default RescheduleInterview;