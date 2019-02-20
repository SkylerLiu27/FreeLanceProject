import { Person } from './person';

export class User {
  userId: string;
  password: string;
  userName: string;
  name: string;
  inActiveDateTime?: any;
  passwordCreatedDateTime: Date;
  lastLoginDateTime: Date;
  loginFailedCount?: any;
  lastLoginFailedDateTime?: any;
  passwordExpirationDateTime: Date;
  person: Person;
  roles?: any[];
  constructor() {
    this.person = new Person();
  }
}
