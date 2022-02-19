import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
export class Tracker {
    constructor(obj = null) {
        this.id = '';
        this.uid = '';
        this.name = '';
        this.domain = '';
        this.url = '';
        if (obj) {
            this.key = obj.key;
            this.id = obj.id || this.id;
            this.uid = obj.uid;
            this.name = obj.name;
            this.domain = obj.domain;
            this.url = obj.url;
            this.notes = obj.notes;
            if (obj.due) {
                this.due = dayjs.utc(obj.due); //come in as UTC
            }
        }
    }
}
