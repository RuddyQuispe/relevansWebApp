import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '@services/config';
import {EmailModelRequestSingle, EmailModelResponseList, EmailModelResponseSingle} from '@models/email';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EmailService {

    private readonly URL: string = `${Config.settings.path.url_root_conf}/configuration/email/v1`;

    constructor(private http: HttpClient) {
    }

    public list = (model: EmailModelRequestSingle): Observable<EmailModelResponseList> =>
        this.http.post<EmailModelResponseList>(`${this.URL}/list`, model)

    public find = (model: EmailModelRequestSingle): Observable<EmailModelResponseSingle> =>
        this.http.post<EmailModelResponseSingle>(`${this.URL}/find`, model)

    public save = (model: EmailModelRequestSingle): Observable<EmailModelResponseSingle> =>
        this.http.post<EmailModelResponseSingle>(`${this.URL}/save`, model)

    public merge = (model: EmailModelRequestSingle): Observable<EmailModelResponseSingle> =>
        this.http.put<EmailModelResponseSingle>(`${this.URL}/merge`, model)
}