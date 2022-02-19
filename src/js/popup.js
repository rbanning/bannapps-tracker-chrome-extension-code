import { __awaiter } from "tslib";
import { TrackerService } from "./tracker.service";
export class PopupComponent {
    run() {
        document.addEventListener('DOMContentLoaded', () => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.SayHello('Rob');
            console.log("DEBUG: say hello", result);
            const trackerService = new TrackerService();
            yield trackerService.getAll()
                .then(results => {
                console.log("DEBUG: tracker records", results);
            })
                .catch(error => {
                console.warn("DEBUG tracker records failed", error);
            });
        }));
    }
    SayHello(name = 'Jane') {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                window.setTimeout(() => {
                    resolve(`Hello ${name || 'unknown'}!  Glad you made it PAL`);
                }, 2000);
            });
        });
    }
}
const pop = new PopupComponent();
pop.run();
