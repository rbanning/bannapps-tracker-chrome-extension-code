import { __awaiter } from "tslib";
import { Settings } from "./settings.model";
export class SettingsService {
    constructor() {
        this.DEFAULT_API = 'https://bannapps-tracker-api.netlify.app/api/';
        this.DEFAULT_KEY = '2605247e886e484ca753012017db8f14';
        this.STORAGE_KEY = 'tracker-settings';
        this.storage = chrome.storage.sync;
        this.refresh();
    }
    get settings() {
        return new Settings(this._settings);
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.storage
                .get(this.STORAGE_KEY)
                .then(result => {
                this.buildSettings((result || {})[this.STORAGE_KEY]);
                return this.settings;
            });
        });
    }
    updateAuth(identity, token = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._settings instanceof Settings) {
                this._settings.setAuth(identity, token);
            }
            else {
                this.buildSettings(Object.assign(Object.assign({}, identity), { token }));
            }
            return yield this.save();
        });
    }
    updateDomains(domains) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._settings instanceof Settings) {
                this._settings.domains = domains;
            }
            else {
                this.buildSettings({ domains });
            }
            return yield this.save();
        });
    }
    addDomain(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            domain = domain === null || domain === void 0 ? void 0 : domain.toLowerCase();
            if (this._settings instanceof Settings) {
                if (Array.isArray(this._settings.domains) && !this._settings.domains.includes(domain)) {
                    this._settings.domains.push(domain);
                }
            }
            else {
                this.buildSettings({ domains: [domain] });
            }
            return yield this.save();
        });
    }
    removeDomain(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            domain = domain === null || domain === void 0 ? void 0 : domain.toLowerCase();
            if (this._settings instanceof Settings) {
                if (Array.isArray(this._settings.domains)) {
                    const index = this._settings.domains.indexOf(domain);
                    if (index >= 0 && index < this._settings.domains.length) {
                        this._settings.domains.splice(index, 1);
                    }
                }
            }
            else {
                this.buildSettings({ domains: [] });
            }
            return yield this.save();
        });
    }
    updateApi(api) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._settings instanceof Settings) {
                this._settings.api = api;
            }
            else {
                this.buildSettings({ api });
            }
            return yield this.save();
        });
    }
    buildSettings(obj) {
        this._settings = new Settings(Object.assign({ api: this.DEFAULT_API, key: this.DEFAULT_KEY }, (obj || {})));
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {};
            data[this.STORAGE_KEY] = this._settings;
            return yield this.storage.set(data)
                .then(() => {
                return this.settings;
            });
        });
    }
}
