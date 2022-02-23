import { Auth, IAuth } from "./auth.model";
import { ISettings } from "./settings.model";
import { SettingsService } from "./settings.service";

interface IAirtableAuthResponse {
  message: string;
  result?: {
    identity?: any;
    token?: string;
  },
  error?: string | string[]
}

export class AuthService {
  settingService: SettingsService;

  constructor() {
    this.settingService = new SettingsService();
  }

  async getAuth(): Promise<IAuth> {
    return await this.settingService.refresh()
      .then((settings: ISettings) => {
        return settings.auth;
      });
  }

  async logout(): Promise<IAuth> {
    const settings = await this.settingService.updateAuth(null, null);
    return settings?.auth;
  }

  async login(email: string, password: string): Promise<IAuth> {
    //setup the call
    return await this.settingService.refresh()
      .then(async (settings: ISettings) => {
        if (settings.api && settings.key) {
          const url = settings.api + 'auth';
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email, password, key: settings.key})
          });
          const body = await response.json() as IAirtableAuthResponse;
          if (response.ok) {
            const auth = new Auth(body?.result);
            if (auth?.isAuthenticated()) {
              await this.settingService.updateAuth(auth);
            }
            return auth;
          } else {
            console.warn(`Login Failed: ${response.status} - ${body}`, {response});
            return null;
          }
        }
        //else
        throw new Error("Oops - settings is missing the api url and/or key");
      });
  }
}