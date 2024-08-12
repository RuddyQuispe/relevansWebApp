import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '@services/config';
import {
    ProfileModelRequestSingle,
    ProfileModelResponseSingle,
    ProfileModelResponseList,
    ProfileModelRequestList
} from '@models/profile';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    private readonly URL: string = `${Config.settings.path.url_root_admin}/administration/profile/v1`;

    constructor(private http: HttpClient) {
    }

    list(model: ProfileModelRequestList) {
        return this.http.post<ProfileModelResponseList>(`${this.URL}/list`, model);
    }

    find(model: ProfileModelRequestSingle) {
        return this.http.post<ProfileModelResponseSingle>(`${this.URL}/find`, model);
    }

    persist(model: ProfileModelRequestSingle) {
        return this.http.post<ProfileModelResponseSingle>(`${this.URL}/save`, model);
    }

    merge(model: ProfileModelRequestSingle) {
        return this.http.post<ProfileModelResponseSingle>(`${this.URL}/merge`, model);
    }


}
