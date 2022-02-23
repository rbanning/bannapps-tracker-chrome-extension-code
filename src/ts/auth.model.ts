export interface IAuth {
  //identity
  uid?: string;
  name?: string;
  contact?: string;
  role?: 'viewer' | 'manager';
  
  //auth
  token?: string;
    
  refresh: (identity?: any, token?: string) => void;
  isAuthenticated: () => boolean;  
}
export class Auth implements IAuth {
  //identity
  uid?: string;
  name?: string;
  contact?: string;
  role?: 'viewer' | 'manager';
  
  //auth
  token?: string;
    
  constructor(obj) {
    this.refresh(obj?.identity || obj, obj?.token);
  }

  refresh(identity?: any, token?: string) {
    this.uid = identity?.uid || identity?.id;
    this.name = identity?.name;
    this.contact = identity?.contact;
    this.role = identity?.role;
    this.token = token || identity?.token;
  }
  isAuthenticated() {
    return !!this.uid && !!this.name && !!this.token;
  }

}