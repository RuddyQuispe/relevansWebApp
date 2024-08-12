import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '@services/config';
import {AccessModelRequest, AccessModelResponse} from '@app/model/access';

@Injectable({
    providedIn: 'root'
})
export class AccessService {

    constructor(private http: HttpClient) {
    }

    public list = (model: AccessModelRequest) =>
        this.http.post<AccessModelResponse>(`${Config.settings.path.url_root_admin}/administration/profile/v1/access/list`, model)
}
