import { __awaiter } from "tslib";
import { Auth } from "./auth.model";
import { SettingsService } from "./settings.service";
export class AuthService {
    constructor() {
        this.settingService = new SettingsService();
    }
    getAuth() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.settingService.refresh()
                .then((settings) => {
                return settings.auth;
            });
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = yield this.settingService.updateAuth(null, null);
            return settings === null || settings === void 0 ? void 0 : settings.auth;
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            //setup the call
            return yield this.settingService.refresh()
                .then((settings) => __awaiter(this, void 0, void 0, function* () {
                if (settings.api && settings.key) {
                    const url = settings.api + 'auth';
                    const response = yield fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password, key: settings.key })
                    });
                    const body = yield response.json();
                    if (response.ok) {
                        const auth = new Auth(body === null || body === void 0 ? void 0 : body.result);
                        if (auth === null || auth === void 0 ? void 0 : auth.isAuthenticated()) {
                            yield this.settingService.updateAuth(auth);
                        }
                        return auth;
                    }
                    else {
                        console.warn(`Login Failed: ${response.status} - ${body}`, { response });
                        return null;
                    }
                }
                //else
                throw new Error("Oops - settings is missing the api url and/or key");
            }));
        });
    }
}
