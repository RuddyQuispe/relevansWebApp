import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {VentaFiltroModel, VentaModel} from 'app/model/venta';
import {ResponseFilterModel} from '@models/response.filter.model';
import {Config} from '@services/config';
import {ArchivoModel} from '@models/archivo.model';

@Injectable({
    providedIn: 'root'
})
export class VentaService {
    private readonly URL: string = `${Config.settings.path.url_root_hiper_vales}/api-hipervale/v1/venta`;

    constructor(private http: HttpClient) {
    }

    public onList = (saleFilterModel: VentaFiltroModel): Observable<ResponseFilterModel<VentaModel>> =>
        this.http.post<ResponseFilterModel<VentaModel>>(`${this.URL}/listar`, saleFilterModel)

    public onFindById = (ventaId: number): Observable<VentaModel> =>
        this.http.get<VentaModel>(`${this.URL}/${ventaId}`)

    public onFindByIdExtended = (ventaId: number): Observable<VentaModel> =>
        this.http.get<VentaModel>(`${this.URL}/readByIdExtendido/${ventaId}`)

    public onMerge = (venta: VentaModel): Observable<VentaModel> =>
        this.http.put<VentaModel>(this.URL, venta)

    public onSave = (venta: VentaModel): Observable<ArchivoModel> =>
        this.http.post<ArchivoModel>(this.URL, venta)

    public onDownloadTemplate = (ventaId: number): Observable<ArchivoModel> =>
        this.http.get<ArchivoModel>(`${this.URL}/descargarPlantilla/${ventaId}`)

    public onUpload = (file: File, ventaId: number): Observable<any> => {
        const formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('idVenta', ventaId.toString());
        return this.http.post<any>(`${this.URL}/cargarPlantilla`, formData);
    }

    public onGenerateSalesReceipt = (ventaId: number): Observable<ArchivoModel> =>
        this.http.get<ArchivoModel>(`${this.URL}/generarComprobante/${ventaId}`)

    public onReverseSale = (ventaId: number): Observable<VentaModel> =>
        this.http.post<VentaModel>(`${this.URL}/revertirVenta`, ventaId)
}
