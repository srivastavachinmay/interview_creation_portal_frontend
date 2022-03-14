import axios                            from "axios";
import { IInterview }                   from "../Models/IInterview";
import { GET_INTERVIEW, PUT_INTERVIEW } from "../Utils/ApiHandler";

export const getInterviews = async () => {
    try {
        const response = await axios.get(GET_INTERVIEW);
        return response.data.interviews as IInterview[];
    } catch (e) {
        console.log(e);
        // @ts-ignore
        alert(e.message.toString());
    }
};

export const getInterviewsById = async ( id: number ) => {
    try {
        const response = await axios.get(`${GET_INTERVIEW}/${id}`);
        return response.data as IInterview;
    } catch (e) {
        console.log(e);
        // @ts-ignore
        alert(e.message.toString());
    }
};

export const putInterview = async ( data: IInterview, param?: object | undefined ) => {
    try {
        await axios.put(PUT_INTERVIEW, data);
    } catch (e) {
        console.log(e);
    }
};

