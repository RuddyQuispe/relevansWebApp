import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '@services/config';
import {EX1Model, EX2Model} from "@app/model/export";

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    constructor(private http: HttpClient) {
    }

    public pathDownload = `${Config.settings.path.url_root_admin}/files/tmp/`;

    exportExcel(model: EX1Model) {
        return this.http.post<EX2Model>(`${Config.settings.path.url_root_admin}/ws-export-tbz/exp/export/exportExcel`, model);
    }
}
