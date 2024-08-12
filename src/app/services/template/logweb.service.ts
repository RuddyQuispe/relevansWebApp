import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '@services/config';
import {LogWebServiceRequestModel, LogWebServiceModelResponse} from '@models/logweb';

@Injectable({
    providedIn: 'root'
})
export class LogwebService {

    private readonly URL: string = `${Config.settings.path.url_root_report}/report/logservice`;

    constructor(private http: HttpClient) {
    }

    public list = (model: LogWebServiceRequestModel) =>
        this.http.post<LogWebServiceModelResponse>(`${this.URL}/v1/list`, model)

    public find = (model: LogWebServiceRequestModel) =>
        this.http.post<any>(`${this.URL}/ws-log-service-tbz/lgs/logservice/find`, model)
}
