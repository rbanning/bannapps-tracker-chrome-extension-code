class TrackerOptions {
  areas: any = {};
  fields: any = {};
  buttons: any = {};
  
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
      submit: document.getElementById("btnSubmit"),
      cancel: document.getElementById("btnCancel")
    };

    console.log("DEBUG: Initializing options", this);
  }
}

(new TrackerOptions()).init();