import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '@services/config';
import {DomainModelRequestSingle, DomainModelResponseList, DomainModelResponseSingle} from '@models/domain';
import {delay, Observable} from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class DomainService {

    private readonly URL: string = `${Config.settings.path.url_root_conf}/configuration/domain/v1`;

    constructor(public http: HttpClient) {
    }

    public onList = (domainRequest: DomainModelRequestSingle): Observable<DomainModelResponseList> =>
        this.http.post<DomainModelResponseList>(`${this.URL}/list`, domainRequest)

    public onMerge = (domainRequest: DomainModelRequestSingle): Observable<DomainModelResponseSingle> =>
        this.http.put<DomainModelResponseSingle>(`${this.URL}/merge`, domainRequest)

    public onSave = (domainRequest: DomainModelRequestSingle): Observable<DomainModelResponseSingle> =>
        this.http.post<DomainModelResponseSingle>(`${this.URL}/save`, domainRequest)

    // find(domain: DomainModelRequestSingle) {
    //    const url: string = Config.settings.path.url_root + '/ws-domain-tbz/dmn/domain/';
    //    return this.http.post(url, domain);
    // }

    // listIn(domain: DI1) {
    //    const url: string = Config.settings.path.url_root + '/ws-domain-tbz/dmn/domain/listIn';
    //    return this.http.post(url, domain);
    // }

}
