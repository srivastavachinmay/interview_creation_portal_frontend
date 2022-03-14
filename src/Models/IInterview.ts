import { IParticipant } from "./IParticipants";

export interface IInterview {
    id?: number,
    startDateTime: Date,
    endDateTime: Date,
    participants: IParticipant[]
}