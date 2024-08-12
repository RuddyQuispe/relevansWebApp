import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Config} from "@services/config";
import {delay, Observable} from "rxjs";
import {RegistroContableVentaModel} from "@models/registro-contable";

@Injectable({
    providedIn: 'root'
})
export class RegistroContableService {

    private readonly URL: string = `${Config.settings.path.url_root_hiper_vales}/api-hipervale/v1/registro-contable`;

    constructor(private http: HttpClient) {
    }

    public onFindByVentaId = (ventaId: number): Observable<RegistroContableVentaModel> =>
        this.http.post<RegistroContableVentaModel>(`${this.URL}/findByVentaId`, ventaId)
            .pipe(delay(2000));
}
