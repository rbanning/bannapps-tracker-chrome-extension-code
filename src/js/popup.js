import { __awaiter } from "tslib";
import { sendMessageAsPromise } from "./send-message-as-promise";
import { SettingsService } from "./settings.service";
import { TrackerService } from "./tracker.service";
export class PopupComponent {
    constructor() {
        this.MESSAGE_KEY = 'page-meta';
        this.areas = {};
        this.fields = {};
        this.buttons = {};
        this.domains = [];
    }
    init() {
        document.addEventListener("DOMContentLoaded", () => __awaiter(this, void 0, void 0, function* () {
            this.refresh();
        }));
    }
    refresh() {
        this.setWorking(true);
        const actions = [
            this.getSettings(),
            sendMessageAsPromise(this.MESSAGE_KEY)
        ];
        Promise.all(actions)
            .then(([settings, pageMeta]) => {
            this.domains = settings === null || settings === void 0 ? void 0 : settings.domains;
            this.meta = pageMeta;
            const trackerService = new TrackerService();
            return trackerService.getAllForSingleDomain(pageMeta === null || pageMeta === void 0 ? void 0 : pageMeta.domain);
        })
            .then((records) => this.loadRecords(records))
            .finally(() => this.setWorking(false));
    }
    loadRecords(records) {
        //todo: implement loadRecords
    }
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const settingsService = new SettingsService();
            return yield settingsService.refresh()
                .then((settings) => {
                return settings;
            });
        });
    }
    setWorking(state) {
        if (this.areas.working) {
            this.areas.working.classList.toggle('show', state);
            Object.keys(this.buttons).forEach(key => {
                if (this.buttons[key]) {
                    this.buttons[key].disabled = state;
                }
            });
        }
    }
}
const pop = new PopupComponent();
pop.init();
