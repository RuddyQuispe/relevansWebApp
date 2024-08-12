import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '@services/config';
import {D1} from '@app/model/dashboard/d1';
import {D2} from '@app/model/dashboard/d2';

@Injectable({
    providedIn: 'root'
})
export class DashboardService{
    constructor(
        private http: HttpClient
    ) {
    }
    list(model: D1) {
        return this.http.post<D2>(`${Config.settings.path.url_root_admin}/ws-qr-web/qr/service/dashboard`, model);
    }
}
