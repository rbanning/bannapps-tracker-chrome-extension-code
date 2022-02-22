class TrackerOptions {
    constructor() {
        this.areas = {};
        this.fields = {};
        this.buttons = {};
    }
    init() {
        console.log("Initializing options...");
        this.areas = {
            profile: document.getElementById("profile"),
            login: document.getElementById("login")
        };
        this.fields = {
            email: document.getElementById("email"),
            password: document.getElementById("password")
        };
        this.buttons = {
            submit: document.getElementById("submit"),
            cancel: document.getElementById("cancel")
        };
        console.log("DEBUG: Initializing options", this);
    }
}
(new TrackerOptions()).init();
