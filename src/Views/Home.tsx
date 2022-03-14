import { useEffect, useState } from "react";
import ReactLoading            from "react-loading";
import { getInterviews }       from "../Axios/Interviews";
import InterviewList           from "../Components/interviewList";
import { IInterview }          from "../Models/IInterview";
import './Home.css';

export default function Home() {
    
    const [interviews,setInterviews]=useState<IInterview[]>([]);
    const [error,setError] =useState<any>(null)
    const [isPending,setIsPending] =useState<boolean>(true)
    // const {
    //           data.interviews: interviews,
    //           isPending,
    //           error,
    //       } = useFetch(`${GET_INTERVIEW}`);
    
    useEffect(() => {
        ( async () => {
            const data = await getInterviews();
            if(!data) {
                // TODO: SHOW ERROR
                setError(data)
                return;
            }
            setIsPending(false);
            
            setInterviews(data)
        } )();
        
    }, []);
    return (
        <div className="home">
            {}
            {error && <h3>Unable to fetch interviews</h3>}
            {isPending &&
                <ReactLoading type={"spin"} className={'loading'} color={'#000'}/>
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