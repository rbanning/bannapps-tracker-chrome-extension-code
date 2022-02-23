export class Auth {
    constructor(obj) {
        this.refresh((obj === null || obj === void 0 ? void 0 : obj.identity) || obj, obj === null || obj === void 0 ? void 0 : obj.token);
    }
    refresh(identity, token) {
        this.uid = (identity === null || identity === void 0 ? void 0 : identity.uid) || (identity === null || identity === void 0 ? void 0 : identity.id);
        this.name = identity === null || identity === void 0 ? void 0 : identity.name;
        this.contact = identity === null || identity === void 0 ? void 0 : identity.contact;
        this.role = identity === null || identity === void 0 ? void 0 : identity.role;
        this.token = token || (identity === null || identity === void 0 ? void 0 : identity.token);
    }
    isAuthenticated() {
        return !!this.uid && !!this.name && !!this.token;
    }
}
