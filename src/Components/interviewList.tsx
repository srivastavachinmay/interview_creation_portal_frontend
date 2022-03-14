import Moment         from "react-moment";
import { Link }       from "react-router-dom";
import { IInterview } from "../Models/IInterview";
import './interviewList.css';
// @ts-ignore
const InterviewList = ( { interviews , title } ) => {
    
    return (
        <div className="interview-list">
            <h1>{title}</h1>
            
            {interviews.map(( interview: IInterview, idx: number ) => (
                <div className="interview-preview" key={interview.id}>
                    <Link
                        to={{
                            pathname: `/interview/${interview.id}`,
                        }}
                        style={{ textDecoration: "none" }}
                    >
                        <div>
                            <h2>Interview {idx + 1}</h2>
                            <p>
                                Date: <Moment format="DD-MM-YYYY">{interview.startDateTime}</Moment>
                            </p>
                            <p>
                                StartTime:{" "}
                                <Moment format="hh:mm A">{interview.startDateTime}</Moment>
                            </p>
                            <p>
                                EndTime: <Moment format="hh:mm A">{interview.endDateTime}</Moment>
                            </p>
                        </div>
                    </Link>
                    <Link
                        to={{
                            pathname: `/reschedule/${interview.id}`,
                        }}
                    >
                        <button className="green-btn">Reschedule</button>
                    </Link>
                   
                </div>
            ))}
        </div>
    );
};

export default InterviewList;