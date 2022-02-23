import { Auth } from "./auth.model";
export class Settings extends Auth {
    constructor(obj) {
        super(obj);
        if (obj) {
            this.domains = obj.domains;
            this.api = obj.api;
            this.key = obj.key;
        }
    }
    get auth() {
        return new Auth(this);
    }
    setAuth(identity, token) {
        super.refresh(identity, token);
    }
    isAuthenticated() {
        return super.isAuthenticated() === true;
    }
}
