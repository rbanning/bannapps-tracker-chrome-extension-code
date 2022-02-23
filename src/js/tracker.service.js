import { __awaiter } from "tslib";
import { AbstractBaseService } from "./abstract-base.service";
import { Tracker } from "./tracker.model";
export class TrackerService extends AbstractBaseService {
    constructor() {
        super('tracker/', Tracker);
    }
    getAllForSingleDomain(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
                method: 'GET',
                headers: this.buildHeaders(),
                //mode: 'cors'
            };
            const url = this.BASE_URL + encodeURI(domain);
            console.log("DEBUG: About to run the getAllForSingleDomain() request", { url, config });
            return yield fetch(url, config)
                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                return yield resp.json();
            }))
                .then((results) => {
                return this.postGetterMultiple(results);
            });
        });
    }
}
