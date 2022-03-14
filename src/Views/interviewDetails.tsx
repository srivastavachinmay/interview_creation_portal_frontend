import ReactLoading      from "react-loading";
import Moment            from "react-moment";
import { useParams }     from "react-router-dom";
import useFetch          from "../Hooks/useFetch";
import './interviewDetails.css';
import { getInterviews } from "../Utils/ApiHandler";

const InterviewDetails = () => {
    const { id } = useParams();
    const {
              data: interview,
              isPending,
              error,
          } = useFetch(`${getInterviews}${id}`);
    
    return (
        <div className="interview-details">
            {error && <p>{error}</p>}
            {isPending && <ReactLoading type={"spin"} className={'loading'} color={'#ECECEC'}/>}
            {interview && (
                <div>
                    <h1>Interview Details</h1>
                    <h2>id: {id}</h2>
                    <br/>
                    <h4>
                        Date: <Moment format="DD-MM-YYYY">{
                        // @ts-ignore
                        interview.startDateTime}</Moment>
                    </h4>
                    <h4>
                        Timings: <Moment format="hh:mm A">{
                        // @ts-ignore
                        interview.startDateTime}</Moment> -{" "}
                        <Moment format="hh:mm A">{
                            // @ts-ignore
                            interview.endDateTime}</Moment>
                    </h4>
                    <br/>
                    <h4>Participants</h4>
                    <ul>
                        {// @ts-ignore
                            interview.participants.map(( participant, idx ) => (
                                <li>{participant.email}</li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
export default InterviewDetails;