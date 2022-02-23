import { Auth, IAuth } from "./auth.model";


export interface ISettings extends IAuth {
  //tracker
  domains?: string[];
  api?: string;
  key?: string;

  readonly auth: IAuth;
}

export class Settings extends Auth implements ISettings {
    //tracker
    domains?: string[];
    api?: string;
    key?: string;

    get auth() {
      return new Auth(this);
    }

    constructor(obj?: any) {
      super(obj);
      if (obj) {
        this.domains = obj.domains;
        this.api = obj.api;
        this.key = obj.key;
      }
    }

    setAuth(identity: any | null, token: string | null) {
      super.refresh(identity, token);
    }

    isAuthenticated() {
      return super.isAuthenticated() === true;
    }
}