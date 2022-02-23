import { IAuth } from "./auth.model";
import { AuthService } from "./auth.service";
import { ISettings } from "./settings.model";
import { SettingsService } from "./settings.service";

type AreaElements = {[key: string]: HTMLElement};
type InputElements = {[key: string]: HTMLInputElement};
type ButtonElements = {[key: string]: HTMLButtonElement};
class TrackerOptions {
  areas: AreaElements = {};
  fields: InputElements = {};
  buttons: ButtonElements = {};
  domains: string[] = [];

  authService: AuthService;

  init() {
    console.log("Initializing options...");
    this.authService = new AuthService();

    this.areas = {
      working: document.getElementById("working"),
      message: document.getElementById("message"),
      profile: document.getElementById("profile"),
      login: document.getElementById("login")
    };
    this.fields = {
      email: document.getElementById("email") as HTMLInputElement,
      password: document.getElementById("password") as HTMLInputElement
    };
    this.buttons = {
      logout: document.getElementById("btnLogout") as HTMLButtonElement,
      close: document.getElementById("btnClose") as HTMLButtonElement,
      submit: document.getElementById("btnSubmit") as HTMLButtonElement,
      cancel: document.getElementById("btnCancel") as HTMLButtonElement
    };

    //setup event listeners
    this.fields.email?.addEventListener('keyup', () => this.resetMessage());
    this.fields.password?.addEventListener('keyup', () => this.resetMessage());
    this.buttons.logout?.addEventListener('click', () => this.logout());
    this.buttons.submit?.addEventListener('click', () => this.login());
    this.buttons.cancel?.addEventListener('click', () => this.cancel());
    this.buttons.close?.addEventListener('click', () => this.cancel());

    this.refresh();
    
  }

  refresh() {
    this.setWorking(true);
    this.getSettings()
      .then(settings => this._showDomains(settings?.domains));

    this.authService.getAuth()
      .then((auth: IAuth) => this.setProfile(auth))
      .catch(err => this.setMessage("Error checking your login status", true))
      .finally(() => this.setWorking(false));
  }

  cancel() {
    return chrome.tabs.getCurrent()
      .then((tab) => {
        if (tab?.id) {
          return chrome.tabs.remove(tab.id);        
        }
        //else
        return null;
      })
  }

  login() {
    this.setMessage(null);
    if (this.fields.email && this.fields.password) {
      this.setWorking(true);
      const email = this.fields.email.value;
      const password = this.fields.password.value;
      this.authService.login(email, password)
        .then((result: IAuth) => {
          if (result?.isAuthenticated()) {
            this.setProfile(result);
          } else {
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
      .then((result: IAuth) => {
        this.setProfile(result);
      })
      .finally(() => this.setWorking(false));
  }

  async getSettings() {
    const settingsService = new SettingsService();
    return await settingsService.refresh()
      .then((settings: ISettings) => {
        return settings;
      });
  }
  private _showDomains(domains: string[]) {
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
      } else {
        domains.forEach(domain => {
          const li = document.createElement('li');
          li.innerText = domain;
          el.append(li);
        });  
      }
    }
  }

  private setWorking(state: boolean) {
    if (this.areas.working) {
      this.areas.working.classList.toggle('show', state);
      Object.keys(this.buttons).forEach(key => {
        if (this.buttons[key]) {
          this.buttons[key].disabled = state;
        }
      });
    }
  }

  private setMessage(message: string | null, isError: boolean = false) {
    if (this.areas.message) {
      this.areas.message.innerText = message || '';
      this.areas.message.classList.toggle('error', isError);
      this.areas.message.classList.toggle('show', !!message);
    }
  }
  private resetMessage() {
    if (this.areas.message?.classList.contains('show')) {
      this.areas.message.classList.remove('show');
    }
  }

  private setProfile(auth: IAuth | null) {
    if (this.areas.profile && this.areas.login) {
      this.areas.profile.classList.toggle('show', auth?.isAuthenticated());
      this.areas.login.classList.toggle('show', !auth?.isAuthenticated());
      this._setProfileDetails(this.areas.profile, auth);
    }
  }
  private _setProfileDetails(container: HTMLElement, auth: IAuth | null) {
    if (auth?.isAuthenticated()) {
      Object.keys(auth).forEach((key: string) => {
        const el = container.querySelector(`span.${key.toLowerCase()}`) as HTMLElement;
        if (el) { el.innerText = auth[key]; }
      });
    }
  }
  
}

(new TrackerOptions()).init();