import { __awaiter } from "tslib";
export class AbstractBaseService {
    constructor(path, modelBuilder) {
        //todo: need to get the token from config/settings
        this.authToken = "eyJhbGciOiJIYWxscGFzcyJ9.eyJpZCI6IjVxTEh5byIsIm5hbWUiOiJDdXNoaW9uIE1vY2siLCJjb250YWN0IjoiYy1tb2NrQGZha2UuY29tIiwicm9sZSI6InZpZXdlciJ9.PTBuSTFjVFlqUmpJNklDZGxKM1lsTm5Jc0lDTnhZR09pUjJOeEFqTXhBek0xY1RZalJETzBVbU40Z1RaM1FqTTFBak55SWlPaWtYWnJKQ0xpSVhaM1ZXYTJKaU9pVUdidkpuSXNJeWI1aEVUeFZqSTZJQ1pwSnll";
        //todo: need to get the base url from config/settings
        const base_url = 'https://bannapps-tracker-api.netlify.app/api/';
        this.BASE_URL = base_url + path;
        this.modelBuilder = modelBuilder;
    }
    //#region >>> GETTERS <<<
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
                method: 'GET',
                headers: this.buildHeaders(),
                //mode: 'cors'
            };
            const url = this.BASE_URL;
            console.log("DEBUG: About to run the getAll() request", config);
            return yield fetch(url, config)
                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                console.log("DEBUG: initial resp", resp);
                return yield resp.json();
            }))
                .then((results) => {
                console.log("DEBUG: raw results", results);
                return this.postGetterMultiple(results);
            });
        });
    }
    //
    //#region >> HELPERS (can be overridden in service)<<
    buildHeaders() {
        const headers = new Headers();
        headers.append("authorization", `Bearer ${this.authToken}`);
        return headers;
    }
    postGetterSingle(resp) {
        if (resp) {
            return new this.modelBuilder(resp.result || resp);
        }
        //else
        return null;
    }
    postGetterMultiple(resp) {
        if (Array.isArray(resp.result)) {
            return resp.result
                .map(obj => this.postGetterSingle(obj));
        }
        //else
        return null;
    }
}
