import { AbstractBaseService } from "./abstract-base.service";
import { Tracker } from "./tracker.model";
export class TrackerService extends AbstractBaseService {
    constructor() {
        super('tracker/', Tracker);
    }
}
