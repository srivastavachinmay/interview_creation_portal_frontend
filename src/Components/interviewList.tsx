import Moment            from "react-moment";
import { Link }          from "react-router-dom";
import './interviewList.css';
import { IInterview }    from "../Models/IInterview";
import { getInterviews } from "../Utils/ApiHandler";
// @ts-ignore
const InterviewList = ( { interviews , title } ) => {
    
    const handleDelete = ( uuid: number | undefined) => {
        fetch(`${getInterviews}${uuid}`, {
            method: "DELETE",
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
                console.log("Successfully deleted interview");
                alert("Successfully deleted Interview");
                window.location.reload();
            })
            .catch(( err ) => {
                const data = JSON.parse(err.message);
                alert(data.message);
                console.log(err);
            });
    };
    
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
                        <button className="green-btn">Reschedule or Edit</button>
                    </Link>
                    <button
                        className="red-btn"
                        onClick={() => {
                            handleDelete(interview.id);
                        }}
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
};

export default InterviewList;