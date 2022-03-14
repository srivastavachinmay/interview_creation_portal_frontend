import React                            from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import NavBar                           from './Components/navBar';
import Home                             from './Views/Home';
import InterviewDetails                 from './Views/interviewDetails';
import RescheduleInterview              from "./Views/rescheduleInterview";
import ScheduleInterview                from './Views/scheduleInterview';

export default function App() {
    return ( <BrowserRouter>
        <NavBar/>
        
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/schedule" element={<ScheduleInterview/>}/>
            <Route path="/interview/:uuid" element={<InterviewDetails/>}/>
            <Route path="/reschedule/:uuid" element={<RescheduleInterview/>}/>
        
        </Routes>
    
    </BrowserRouter> );
}
