
  export interface IApiStandardResponse {
    message: string;
    result?: any | any[];
  }



export abstract class AbstractBaseService<T> {
  protected readonly BASE_URL: string;
  protected readonly modelBuilder: {new (obj?: any): T};
  protected readonly authToken: string | null;


  constructor(
    path: string,
    modelBuilder: {new (obj?: any): T}
  ) {

    //todo: need to get the token from config/settings
    this.authToken = "eyJhbGciOiJIYWxscGFzcyJ9.eyJpZCI6IjVxTEh5byIsIm5hbWUiOiJDdXNoaW9uIE1vY2siLCJjb250YWN0IjoiYy1tb2NrQGZha2UuY29tIiwicm9sZSI6InZpZXdlciJ9.PTBuSTFjVFlqUmpJNklDZGxKM1lsTm5Jc0lDTnhZR09pUjJOeEFqTXhBek0xY1RZalJETzBVbU40Z1RaM1FqTTFBak55SWlPaWtYWnJKQ0xpSVhaM1ZXYTJKaU9pVUdidkpuSXNJeWI1aEVUeFZqSTZJQ1pwSnll";

    //todo: need to get the base url from config/settings
    const base_url = 'https://bannapps-tracker-api.netlify.app/api/';
    this.BASE_URL = base_url + path;

    this.modelBuilder = modelBuilder;
  }

  //#region >>> GETTERS <<<
    async getAll(): Promise<T[]> {
      const config: RequestInit = {
        method: 'GET',
        headers: this.buildHeaders(),
        mode: 'cors'
      };
      const url = this.BASE_URL;
      return await fetch(url, config)
        .then(async (resp) => {
          return await resp.json();
        })
        .then((results: IApiStandardResponse) => {
          return this.postGetterMultiple(results);
        });
    }

  //


  //#region >> HELPERS (can be overridden in service)<<

  protected buildHeaders(): Headers {
    const headers = new Headers();
    headers.append("authorization", `Bearer ${this.authToken}`);
    return headers;
  }

  protected postGetterSingle(resp: IApiStandardResponse): T | null {
    if (resp) {
      return new this.modelBuilder(resp.result);
    }
    //else
    return null;
  }
  protected postGetterMultiple(resp: IApiStandardResponse): T[] | null {
    if (Array.isArray(resp.result)) {
      return resp.result
        .map(obj => this.postGetterSingle(obj));
    }
    //else
    return null;
  }
}