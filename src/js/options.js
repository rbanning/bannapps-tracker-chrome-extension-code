import { __awaiter } from "tslib";
import { AuthService } from "./auth.service";
import { SettingsService } from "./settings.service";
class TrackerOptions {
    constructor() {
        this.areas = {};
        this.fields = {};
        this.buttons = {};
        this.domains = [];
    }
    init() {
        var _a, _b, _c, _d, _e, _f;
        console.log("Initializing options...");
        this.authService = new AuthService();
        this.areas = {
            working: document.getElementById("working"),
            message: document.getElementById("message"),
            profile: document.getElementById("profile"),
            login: document.getElementById("login")
        };
        this.fields = {
            email: document.getElementById("email"),
            password: document.getElementById("password")
        };
        this.buttons = {
            logout: document.getElementById("btnLogout"),
            close: document.getElementById("btnClose"),
            submit: document.getElementById("btnSubmit"),
            cancel: document.getElementById("btnCancel")
        };
        //setup event listeners
        (_a = this.fields.email) === null || _a === void 0 ? void 0 : _a.addEventListener('keyup', () => this.resetMessage());
        (_b = this.fields.password) === null || _b === void 0 ? void 0 : _b.addEventListener('keyup', () => this.resetMessage());
        (_c = this.buttons.logout) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => this.logout());
        (_d = this.buttons.submit) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => this.login());
        (_e = this.buttons.cancel) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => this.cancel());
        (_f = this.buttons.close) === null || _f === void 0 ? void 0 : _f.addEventListener('click', () => this.cancel());
        this.refresh();
    }
    refresh() {
        this.setWorking(true);
        this.getSettings()
            .then(settings => this._showDomains(settings === null || settings === void 0 ? void 0 : settings.domains));
        this.authService.getAuth()
            .then((auth) => this.setProfile(auth))
            .catch(err => this.setMessage("Error checking your login status", true))
            .finally(() => this.setWorking(false));
    }
    cancel() {
        return chrome.tabs.getCurrent()
            .then((tab) => {
            if (tab === null || tab === void 0 ? void 0 : tab.id) {
                return chrome.tabs.remove(tab.id);
            }
            //else
            return null;
        });
    }
    login() {
        this.setMessage(null);
        if (this.fields.email && this.fields.password) {
            this.setWorking(true);
            const email = this.fields.email.value;
            const password = this.fields.password.value;
            this.authService.login(email, password)
                .then((result) => {
                if (result === null || result === void 0 ? void 0 : result.isAuthenticated()) {
                    this.setProfile(result);
                }
                else {
                    this.setMessage("Invalid email and/or password - please try again", true);
                }
            })
                .catch(err => {
                console.warn("DEBUG: Fail login", err);
                this.setMessage("There was a problem logging you in - please try again", true);
            })
                .finally(() => this.setWorking(false));
        }
    }
    logout() {
        this.setMessage(null);
        this.setWorking(true);
        this.authService.logout()
            .then((result) => {
            this.setProfile(result);
        })
            .finally(() => this.setWorking(false));
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
    _showDomains(domains) {
        const el = document.getElementById('domains');
        if (el) {
            //clear 
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
            if (!domains || domains.length === 0) {
                const div = document.createElement('div');
                div.innerText = "no domains have been set";
                el.append(div);
            }
            else {
                domains.forEach(domain => {
                    const li = document.createElement('li');
                    li.innerText = domain;
                    el.append(li);
                });
            }
        }
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
    setMessage(message, isError = false) {
        if (this.areas.message) {
            this.areas.message.innerText = message || '';
            this.areas.message.classList.toggle('error', isError);
            this.areas.message.classList.toggle('show', !!message);
        }
    }
    resetMessage() {
        var _a;
        if ((_a = this.areas.message) === null || _a === void 0 ? void 0 : _a.classList.contains('show')) {
            this.areas.message.classList.remove('show');
        }
    }
    setProfile(auth) {
        if (this.areas.profile && this.areas.login) {
            this.areas.profile.classList.toggle('show', auth === null || auth === void 0 ? void 0 : auth.isAuthenticated());
            this.areas.login.classList.toggle('show', !(auth === null || auth === void 0 ? void 0 : auth.isAuthenticated()));
            this._setProfileDetails(this.areas.profile, auth);
        }
    }
    _setProfileDetails(container, auth) {
        if (auth === null || auth === void 0 ? void 0 : auth.isAuthenticated()) {
            Object.keys(auth).forEach((key) => {
                const el = container.querySelector(`span.${key.toLowerCase()}`);
                if (el) {
                    el.innerText = auth[key];
                }
            });
        }
    }
}
(new TrackerOptions()).init();
