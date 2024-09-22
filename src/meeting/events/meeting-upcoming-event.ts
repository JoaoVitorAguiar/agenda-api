export class MeetingUpcomingEvent {
  name: string;
  date: Date;
  attendees: string[];

  constructor(name: string, date: Date, attendees: string[]) {
    this.name = name;
    this.date = date;
    this.attendees = attendees;
  }
}
