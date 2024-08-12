import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '@services/config';
import {JobModelRequestSingle, JobModelResponseList, JobModelResponseSingle} from '@models/job';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class JobService {

    private readonly URL: string = `${Config.settings.path.url_root_conf}/configuration/job/v1`;

    constructor(private http: HttpClient) {
    }

    onList(job: JobModelRequestSingle): Observable<JobModelResponseList> {
        return this.http.post<JobModelResponseList>(`${this.URL}/list`, job);
    }

    onMergue(job: JobModelRequestSingle): Observable<JobModelResponseSingle> {
        return this.http.put<JobModelResponseSingle>(`${this.URL}/merge`, job);
    }

    onSave(job: JobModelRequestSingle): Observable<JobModelResponseSingle> {
        return this.http.post<JobModelResponseSingle>(`${this.URL}/save`, job);
    }

    onFind(job: JobModelRequestSingle): Observable<JobModelResponseSingle> {
        return this.http.post<JobModelResponseSingle>(`${this.URL}/find`, job);
    }
}
