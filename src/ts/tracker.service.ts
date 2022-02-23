import { AbstractBaseService, IApiStandardResponse } from "./abstract-base.service";
import { ITracker, Tracker } from "./tracker.model";


export class TrackerService extends AbstractBaseService<ITracker> {

  constructor() {
    super(
      'tracker/',
      Tracker
    );
  }

  async getAllForSingleDomain(domain: string): Promise<ITracker[]> {
    const config: RequestInit = {
      method: 'GET',
      headers: this.buildHeaders(),
      //mode: 'cors'
    };
    const url = this.BASE_URL + encodeURI(domain);
    console.log("DEBUG: About to run the getAllForSingleDomain() request", {url, config});
    return await fetch(url, config)
      .then(async (resp) => {
        return await resp.json();
      })
      .then((results: IApiStandardResponse) => {
        return this.postGetterMultiple(results);
      });

  }
}