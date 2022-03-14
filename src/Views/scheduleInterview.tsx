import { FormEvent, useEffect, useState } from "react";
import DateTimePicker                     from "react-datetime-picker";
import ReactLoading                       from "react-loading";
import { useNavigate }                    from "react-router-dom";
import Select                             from "react-select";
import makeAnimated                       from "react-select/animated";
import { getParticipant }                 from "../Axios/Participants";
import { IParticipant }                   from "../Models/IParticipants";
import { PUT_INTERVIEW }                  from "../Utils/ApiHandler";
import { ErrorBoundary }                  from "../Utils/ErrorBoundaries";
import './scheduleInterview.css';

const ScheduleInterview = () => {
    
    const [candidateData, setCandidateData] = useState<IParticipant[]>([]);
    const [interviewerData, setInterviewerData] = useState<IParticipant[]>([]);
    const [isPending,setIsPending] = useState<boolean>(false)
    const animatedComponents = makeAnimated();
    const [startTime, setStartTime] = useState<any>(new Date());
    const [endTime, setEndTime] = useState<any>(new Date());
    const [candidates, setCandidates] = useState<String[]>([]);
    const [interviewers, setInterviewers] = useState<String[]>([]);
    const history = useNavigate();
    
    useEffect(() => {
        ( async () => {
            const data = await getParticipant();
            if(!data) {
                // TODO: SHOW ERROR
                return;
            }
            
            setInterviewerData(data.filter(( d ) => d.type === 'Interviewer'));
            setCandidateData(data.filter(( d ) => d.type === 'Candidate'));
            
            console.log("candidate data");
            console.log(data);
            console.log(candidateData);
            console.log(interviewerData);
            
        } )();
        
    }, []);
    
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
        console.log(candidates);
        console.log(interviewers);
        const interview = {
            startDateTime: startTime,
            endDateTime: endTime,
            participants: [...interviewers, ...candidates],
        };
        console.log(interview);
    
        setIsPending(false);
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
        <ErrorBoundary>
            <div className="create">
                <h1>Schedule a new interview</h1>
                <br/>
                {( isPending ) && (
                    <ReactLoading type={"spin"} className={'loading'} color={'#ECECEC'}/>
                )}
                {candidateData && interviewerData &&
                    ( <>
                            <form onSubmit={handleSubmit}>
                    
                                <label>Start Time :</label>
                                <DateTimePicker minDate={new Date()} onChange={setStartTime}
                                                value={startTime}/>
                                <label>End Time : </label>
                                <DateTimePicker minDate={startTime} onChange={setEndTime}
                                                value={endTime}/>
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
                        </>
                    )}
            </div>
        </ErrorBoundary>
    );
};

export default ScheduleInterview;