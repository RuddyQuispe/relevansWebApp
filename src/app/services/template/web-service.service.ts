import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '@services/config';
import {Observable} from 'rxjs';
import {
    WebServiceModelRequestSingle,
    WebServiceModelResponseList,
    WebServiceModelResponseSingle
} from '@models/webservice';

@Injectable({
    providedIn: 'root'
})
export class WebServiceService {

    private readonly URL: string = `${Config.settings.path.url_root_conf}/configuration/webservice/v1`;

    constructor(public http: HttpClient) {
        console.log('Servicio de WebService');
    }

    public onList = (webServiceRequest: WebServiceModelRequestSingle): Observable<WebServiceModelResponseList> =>
        this.http.post<WebServiceModelResponseList>(`${this.URL}/list`, webServiceRequest)

    public onCustomList = (webServiceRequest: WebServiceModelRequestSingle): Observable<WebServiceModelResponseList> =>
        this.http.post<WebServiceModelResponseList>(`${this.URL}/list_custom_parameter`, webServiceRequest)

    onSave(webServiceRequest: WebServiceModelRequestSingle): Observable<WebServiceModelResponseSingle> {
        return this.http.post<WebServiceModelResponseSingle>(`${this.URL}/save`, webServiceRequest);
    }

    onMerge(webServiceRequest: WebServiceModelRequestSingle): Observable<WebServiceModelResponseSingle> {
        return this.http.put<WebServiceModelResponseSingle>(`${this.URL}/merge`, webServiceRequest);
    }

    onSaveCustomParameter(webServiceRequest: WebServiceModelRequestSingle): Observable<WebServiceModelResponseSingle> {
        return this.http.post<WebServiceModelResponseSingle>(`${this.URL}/save_custom_parameter`, webServiceRequest);
    }

    onMergeCustomParameter(webServiceRequest: WebServiceModelRequestSingle): Observable<WebServiceModelResponseSingle> {
        return this.http.post<WebServiceModelResponseSingle>(`${this.URL}/merge_custom_parameter`, webServiceRequest);
    }
}
