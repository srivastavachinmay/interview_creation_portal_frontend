import axios               from "axios";
import { IParticipant }    from "../Models/IParticipants";
import { GET_PARTICIPANT } from "../Utils/ApiHandler";

export const getParticipant = async ( param?: object | undefined ) => {
    try {
        const response = await axios.get(GET_PARTICIPANT);
        return response.data.participants as IParticipant[];
    } catch (e) {
        console.log(e);
    }
};