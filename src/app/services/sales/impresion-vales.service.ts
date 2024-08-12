import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {VentaFiltroModel, VentaModel} from '@models/venta';
import {Observable} from 'rxjs';
import {ResponseFilterModel} from '@models/response.filter.model';
import {CorteValeImprimirModel} from '@models/corte-vale';
import {Config} from '@services/config';
import {ArchivoModel} from '@models/archivo.model';

@Injectable({
    providedIn: 'root'
})
export class ImpresionValesService {
    private readonly URL: string = `${Config.settings.path.url_root_hiper_vales}/api-hipervale/v1/imprimir`;

    constructor(private http: HttpClient) {
    }

    public onList = (saleFilterModel: VentaFiltroModel): Observable<ResponseFilterModel<VentaModel>> =>
        this.http.post<ResponseFilterModel<VentaModel>>(`${this.URL}/listar`, saleFilterModel)

    public onPrint = (voucherCutsToPrint: Array<CorteValeImprimirModel>): Observable<ArchivoModel> =>
        this.http.post<ArchivoModel>(this.URL, voucherCutsToPrint)
}
