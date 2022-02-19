import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export interface ITracker {
  key: string;
  id: string;
  uid: string;
  name: string;
  domain: string;
  url: string;
  notes?: string;
  due?: dayjs.Dayjs;
}


export class Tracker implements ITracker {
  key: string;
  id: string = '';
  uid: string = '';
  name: string = '';
  domain: string = '';
  url: string = '';
  notes?: string;
  due?: dayjs.Dayjs;

  constructor(obj: any = null) {

    if (obj) {
      this.key = obj.key;
      this.id = obj.id || this.id;
      this.uid = obj.uid;
      this.name = obj.name;
      this.domain = obj.domain;
      this.url = obj.url;
      this.notes = obj.notes;
      if (obj.due) {
        this.due = dayjs.utc(obj.due);  //come in as UTC
      }
    }
  }

}