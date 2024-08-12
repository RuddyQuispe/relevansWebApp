import {Injectable} from '@angular/core';
import {Config} from "@services/config";
import {HttpClient} from "@angular/common/http";
import {
    ConsumerFilterModel,
    ConsumoValeModel,
    ConsumoValesRequestModel,
    ConsumoValesResponseModel,
    ReservaConsumoValesRequestModel,
    ReservaConsumoValesResponseModel
} from "@models/vale";
import {Observable} from "rxjs";
import {ResponseFilterModel} from "@models/response.filter.model";

@Injectable({
    providedIn: 'root'
})
export class ConsumoService {

    private readonly URL: string = `${Config.settings.path.url_root_hiper_vales}/api-hipervale/v1/consumo`;

    constructor(private http: HttpClient) {
    }

    public onListConsumerVoucherReportByFilter = (filter: ConsumerFilterModel): Observable<ResponseFilterModel<ConsumoValeModel>> =>
        this.http.post<ResponseFilterModel<ConsumoValeModel>>(`${this.URL}/listar`, filter)

    public onReserveConsumerVouchers = (consumerReserveModel: ReservaConsumoValesRequestModel)
        : Observable<ReservaConsumoValesResponseModel> =>
        this.http.post<ReservaConsumoValesResponseModel>(`${this.URL}/reservarConsumoVale`, consumerReserveModel)

    public onConfirmConsumerVouchers = (consumerModel: ConsumoValesRequestModel) =>
        this.http.post<ConsumoValesResponseModel>(`${this.URL}/confirmarConsumoVale`, consumerModel)
}
