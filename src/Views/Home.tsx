import ReactLoading      from "react-loading";
import InterviewList     from "../Components/interviewList";
import useFetch          from "../Hooks/useFetch";
import './Home.css';
import { getInterviews } from "../Utils/ApiHandler";

export default function Home() {
    const {
              data : interviews,
              isPending,
              error,
          } = useFetch(`${getInterviews}`);
    
    return (
        <div className="home">
            {error && <h3>Unable to fetch interviews</h3>}
            {isPending &&
                <ReactLoading type={"spin"} className={'loading'} color={'#ECECEC'}/>
            }
            
            {// @ts-ignore
                interviews && interviews.length > 0 && error == null && (
                    <InterviewList interviews={interviews} title={"Upcoming Interviews"}/>
                )}
            {// @ts-ignore
                interviews && interviews.length <= 0 && error == null && (
                    <div>No Upcoming interviews.</div>
                )}
        </div>
    );
};