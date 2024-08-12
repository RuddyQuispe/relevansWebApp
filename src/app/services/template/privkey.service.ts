import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '@services/config';
import {PrivkeyModelRequest, PrivkeyModelResponseSingle, PrivkeyModelResponseList} from '@models/privkey';

@Injectable({
    providedIn: 'root'
})
export class PrivkeyService {

    constructor(private http: HttpClient) {
    }

    persist(model: PrivkeyModelRequest) {
        return this.http.post<PrivkeyModelResponseSingle>(`${Config.settings.path.url_root_admin}/administration/privkey/v1/save`, model);
    }

    merge(model: PrivkeyModelRequest) {
        return this.http.post<PrivkeyModelResponseSingle>(`${Config.settings.path.url_root_admin}/administration/privkey/v1/merge`, model);
    }

    list(model: PrivkeyModelRequest) {
        return this.http.post<PrivkeyModelResponseList>(`${Config.settings.path.url_root_admin}/administration/privkey/v1/list`, model);
    }

    find(model: PrivkeyModelRequest) {
        return this.http.post<PrivkeyModelResponseSingle>(`${Config.settings.path.url_root_admin}/administration/privkey/v1/find`, model);
    }
}
