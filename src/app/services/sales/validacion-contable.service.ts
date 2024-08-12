import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {VentaFiltroModel, VentaModel} from 'app/model/venta';
import {VentaParametroSaiModel} from '@models/parametros-sai';
import {ResponseFilterModel} from '@models/response.filter.model';
import {Config} from '@services/config';

@Injectable({
    providedIn: 'root'
})
export class ValidacionContableService {
    private readonly URL: string = `${Config.settings.path.url_root_hiper_vales}/api-hipervale/v1/validacionContable`;

    constructor(private http: HttpClient) {
    }

    public onList = (saleFilterModel: VentaFiltroModel): Observable<ResponseFilterModel<VentaModel>> =>
        this.http.post<ResponseFilterModel<VentaModel>>(`${this.URL}/listar`, saleFilterModel)

    public onValidate = (saleModel: VentaModel): Observable<VentaModel> =>
        this.http.post<VentaModel>(this.URL, saleModel)

    public onValidateMultiple = (ids: Array<number>): Observable<Array<string>> =>
        this.http.post<Array<string>>(`${this.URL}/all`, ids)
}
