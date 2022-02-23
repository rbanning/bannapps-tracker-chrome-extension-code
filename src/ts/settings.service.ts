import { ISettings, Settings } from "./settings.model";

export class SettingsService {
  private readonly DEFAULT_API = 'https://bannapps-tracker-api.netlify.app/api/';
  private readonly DEFAULT_KEY = '2605247e886e484ca753012017db8f14';
  private readonly STORAGE_KEY = 'tracker-settings';

  private storage = chrome.storage.sync;

  private _settings: ISettings;
  get settings() {
    return new Settings(this._settings);
  }

  constructor() {
    this.refresh();
  }

  async refresh(): Promise<ISettings> {
    return await this.storage
      .get(this.STORAGE_KEY)
      .then(result => {
        this.buildSettings((result || {})[this.STORAGE_KEY]);
        return this.settings;
      });
  }

  async updateAuth(identity: any | null, token: string | null = null): Promise<ISettings> {
    if (this._settings instanceof Settings) {
      this._settings.setAuth(identity, token);
    } else {
      this.buildSettings({...identity, token});
    }
    return await this.save();
  }

  async updateDomains(domains: string[]) {
    if (this._settings instanceof Settings) {
      this._settings.domains = domains;
    } else {
      this.buildSettings({domains});
    }
    return await this.save();
  }

  async addDomain(domain: string): Promise<ISettings> {
    domain = domain?.toLowerCase();
    if (this._settings instanceof Settings) {
      if (Array.isArray(this._settings.domains) && !this._settings.domains.includes(domain)) {
        this._settings.domains.push(domain);
      }
    } else {
      this.buildSettings({domains: [domain]});
    }
    return await this.save();
  }
  async removeDomain(domain: string): Promise<ISettings> {
    domain = domain?.toLowerCase();
    if (this._settings instanceof Settings) {
      if (Array.isArray(this._settings.domains)) {
        const index = this._settings.domains.indexOf(domain);
        if (index >= 0 && index < this._settings.domains.length) {
          this._settings.domains.splice(index, 1);
        }
      }
    } else {
      this.buildSettings({domains: []});
    }
    return await this.save();
  }

  async updateApi(api: string) {
    if (this._settings instanceof Settings) {
      this._settings.api = api;
    } else {
      this.buildSettings({api});
    }
    return await this.save();
  }


  private buildSettings(obj: any) {
    this._settings = new Settings({
      api: this.DEFAULT_API,
      key: this.DEFAULT_KEY,
      ...(obj || {})
    });
  }

  private async save(): Promise<ISettings> {
    const data = {};
    data[this.STORAGE_KEY] = this._settings;
    return await this.storage.set(data)
      .then(() => {
        return this.settings;
      })
  }
}