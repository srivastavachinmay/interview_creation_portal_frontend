export interface IParticipant {
    id: number,
    name: string,
    email: string,
    type: "Interviewer" | "Candidate"
}