import { useEffect, useState } from "react";
import ReactLoading            from "react-loading";
import Moment                  from "react-moment";
import { useParams }           from "react-router-dom";
import { getInterviewsById }   from "../Axios/Interviews";
import { IInterview }          from "../Models/IInterview";
import './interviewDetails.css';

const InterviewDetails = () => {
    const { id } = useParams();
    
    const [interview, setInterview] = useState<IInterview>();
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        ( async () => {
            const data = await getInterviewsById(Number(id));
            setIsPending(false);
            
            if(!data) {
                // TODO: SHOW ERROR
                alert("Error in parsing data")
                return;
            }
            
            setInterview(data);
            console.log(data);
        } )();
        
    }, []);
    console.log(id);
    console.log(interview)
    return (
        <div className="interview-details">
            
            {error && <p>{error}</p>}
            {isPending && <ReactLoading type={"spin"} className={'loading'} color={'#000'}/>}
            {interview && (
                <div>
                    <h1>Interview Details</h1>
                    <h2>id: {id}</h2>
                    <h4>
                        Date: <Moment format="DD-MM-YYYY">{
                        interview.startDateTime}</Moment>
                    </h4>
                    <h4>
                        Timings: <Moment format="hh:mm A">{
                      
                        interview.startDateTime}</Moment> -{" "}
                        <Moment format="hh:mm A">{
                            interview.endDateTime}</Moment>
                    </h4>
                    <h4>Participants</h4>
                    <ul>
                        <h4>Candidates</h4>
                        {
                            <ul>
                                {
                                    interview.participants.filter(( d ) => d.type === 'Candidate').map(
                                        ( participant, idx ) => (
                                            <li>Name: {participant.name}  <br/> Email: {participant.email} <br/> <br/> </li>
                                            
                                        ))
                                }
                            </ul>
                        }
                        <h4>Interviewers</h4>
                        {
                            <ul>
                                {
                                    interview.participants.filter(( d ) => d.type === 'Interviewer').map(
                                        ( participant, idx ) => (
                                            <li>Name: {participant.name}  <br/> Email: {participant.email} <br/> <br/> </li>
                                        ))
                                }
                            </ul>
                        }
                    </ul>
                </div>
            )}
        </div>
    );
};
export default InterviewDetails;