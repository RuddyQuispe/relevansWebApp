import {Injectable} from '@angular/core';
import {Config} from '@services/config';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ValeFilterModel, ValeFraccionamientoRequestModel} from '@models/vale';
import {ResponseFilterModel} from '@models/response.filter.model';
import {ValeModel} from '@models/vale';
import {ArchivoModel} from '@models/archivo.model';

@Injectable({
    providedIn: 'root'
})
export class ValeService {

    private readonly URL: string = `${Config.settings.path.url_root_hiper_vales}/api-hipervale/v1/vale`;

    constructor(private http: HttpClient) {
    }

    public onList = (saleFilterModel: ValeFilterModel): Observable<ResponseFilterModel<ValeModel>> =>
        this.http.post<ResponseFilterModel<ValeModel>>(`${this.URL}/listar`, saleFilterModel)


    public onFindById = (valeId: number): Observable<ValeModel> =>
        this.http.get<ValeModel>(`${this.URL}/${valeId}`)

    public onRenovateVoucher = (voucherModel: ValeModel): Observable<ValeModel> =>
        this.http.post<ValeModel>(`${this.URL}/renovar`, voucherModel)

    public onDivideVoucher = (voucherDividedModel: ValeFraccionamientoRequestModel): Observable<Array<ValeModel>> =>
        this.http.post<Array<ValeModel>>(`${this.URL}/fraccionar`, voucherDividedModel)

    public onPunishmentVoucher = (voucherModel: ValeModel): Observable<ValeModel> =>
        this.http.post<ValeModel>(`${this.URL}/castigar`, voucherModel)

    public onPunishmentVoucherMultiple = (vouchersNo: Array<number>): Observable<Array<string>> =>
        this.http.post<Array<string>>(`${this.URL}/castigarAll`, vouchersNo)

    public onGenerateImagen64 = (voucherModel: ValeModel): Observable<ArchivoModel> =>
        this.http.post<ArchivoModel>(`${this.URL}/imagenVale`, voucherModel)

    public onPrintVouchers = (vouchers: Array<ValeModel>): Observable<ArchivoModel> =>
        this.http.post<ArchivoModel>(`${this.URL}/imprimirVales`, vouchers)

    public onFindByHash = (hashVoucher: string): Observable<ValeModel> =>
        this.http.post<ValeModel>(`${this.URL}/readByHash`, hashVoucher)

    public onRedeemVoucher = (voucherModel: ValeModel) =>
        this.http.post<ValeModel>(`${this.URL}/revertir`, voucherModel)
}
