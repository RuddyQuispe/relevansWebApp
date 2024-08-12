import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '@services/config';
import {Observable} from 'rxjs';
import {QueryModelRequestSingle, QueryModelResponseList, QueryModelResponseSingle} from '@models/query';

@Injectable({
    providedIn: 'root'
})
export class QueryService {

    private readonly URL: string = `${Config.settings.path.url_root_conf}/configuration/query/v1`;

    constructor(private http: HttpClient) {
    }

    list(queryRequest: QueryModelRequestSingle): Observable<QueryModelResponseList> {
        return this.http.post<QueryModelResponseList>(`${this.URL}/list`, queryRequest);
    }

    find(queryRequest: QueryModelRequestSingle): Observable<QueryModelResponseSingle> {
        return this.http.post<QueryModelResponseSingle>(`${this.URL}/find`, queryRequest);
    }

    validate(queryRequest: QueryModelRequestSingle): Observable<any> {
        return this.http.post<any>(`${this.URL}/validate`, queryRequest);
    }

    merge(queryRequest: QueryModelRequestSingle): Observable<QueryModelResponseSingle> {
        return this.http.put<QueryModelResponseSingle>(`${this.URL}/merge`, queryRequest);
    }

    save(queryRequest: QueryModelRequestSingle): Observable<QueryModelResponseSingle> {
        return this.http.post<QueryModelResponseSingle>(`${this.URL}/save`, queryRequest);
    }
}
