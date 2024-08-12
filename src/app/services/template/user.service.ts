import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '@services/config';
import {UserModelRequestSingle, UserModelResponseList, UserModelResponseSingle} from '@models/user';
import {Observable} from 'rxjs';
import {ChangePasswordRequestModel, ChangePasswordResponseModel} from '@models/password';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly URL: string = `${Config.settings.path.url_root_admin}/administration/user`;

    constructor(private http: HttpClient) {
    }

    list(userRequest: UserModelRequestSingle): Observable<UserModelResponseList> {
        return this.http.post<UserModelResponseList>(`${this.URL}/v1/list`, userRequest);
    }

    find(userRequest: UserModelRequestSingle): Observable<UserModelResponseSingle> {
        return this.http.post<UserModelResponseSingle>(`${this.URL}/v1/find`, userRequest);
    }

    save(userRequest: UserModelRequestSingle): Observable<UserModelResponseSingle> {
        return this.http.post<UserModelResponseSingle>(`${this.URL}/v1/save`, userRequest);
    }

    merge(userRequest: UserModelRequestSingle): Observable<UserModelResponseSingle> {
        const {userId} = userRequest.user;
        return this.http.put<UserModelResponseSingle>(`${this.URL}/v1/merge`, userRequest);
    }

    validateLdap(userRequest: UserModelRequestSingle): Observable<UserModelResponseSingle> {
        return this.http.post<UserModelResponseSingle>(`${this.URL}/validate`, userRequest);
    }

    resetPassword(request: ChangePasswordRequestModel) {
        return this.http.post<ChangePasswordResponseModel>(
            `${Config.settings.path.url_root_admin}/ws-login-tbz/v1/update_password`, request);
    }

    sendMail(model: UserModelRequestSingle): Observable<UserModelResponseSingle> {
        return this.http.post<UserModelResponseSingle>(`${this.URL}/sendMail`, model);
    }

    changePassST(model: UserModelRequestSingle): Observable<UserModelResponseSingle> {
        return this.http.post<UserModelResponseSingle>(`${this.URL}/changePassST`, model);
    }
}
