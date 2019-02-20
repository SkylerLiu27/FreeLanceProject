import { Person } from './person';

export class RequestMoreInfo {
    requestId: string;
    requestedDateTime: Date;
    videoId: string;
    personId: string;
    message: string;
    person: Person;
    asGuest: boolean;
    videoURL: string;
    constructor() {
        this.person = new Person();
    }
}