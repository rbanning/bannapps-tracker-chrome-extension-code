import { __awaiter } from "tslib";
export class PopupComponent {
    run() {
        document.addEventListener("DOMContentLoaded", () => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.SayHello();
            console.log("DEBUG: say hello", result);
            chrome.runtime.sendMessage({ id: "page-meta" }, (response) => {
                console.log("DEBUG: Response from BG.page-meta", response);
            });
            // const trackerService = new TrackerService();
            // await trackerService.getAll()
            //   .then(results => {
            //     console.log("DEBUG: tracker records", results);
            //     chrome.runtime.sendMessage(
            //       {id: 'badge-text', text: `${results.length}`},
            //       response => {
            //         console.log("DEBUG: Response from BG", response);
            //       });
            //   })
            //   .catch(error => {
            //     console.warn("DEBUG tracker records failed", error);
            //   })
        }));
    }
    SayHello() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const [tab] = yield chrome.tabs.query({
                    active: true,
                    currentWindow: true,
                });
                console.log("DEBUG: SayHello", tab);
                resolve(`Hello ${tab.title || "unknown"}, url is [${tab.url || "no url"}]`);
            }));
        });
    }
}
const pop = new PopupComponent();
pop.run();
