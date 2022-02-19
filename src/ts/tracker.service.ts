import { AbstractBaseService } from "./abstract-base.service";
import { ITracker, Tracker } from "./tracker.model";


export class TrackerService extends AbstractBaseService<ITracker> {

  constructor() {
    super(
      'tracker/',
      Tracker
    );
  }
}