import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Config} from '@services/config';
import {GenericSearchRequestModel} from '@models/generic-response';
import {UserDatosAdicionalesByTypeModelRequest, UserParametrosSaiModel} from '@models/parametros-sai';
import {UserDatosAdicionalesModel} from "@models/unidad-negocio";
import {T_DOMAIN_NAME} from "@app/utils/constants";

@Injectable({
    providedIn: 'root'
})
export class ParametrosSaiService {

    private readonly URL: string = `${Config.settings.path.url_root_hiper_vales}/api-hipervale/v1/parametros-sai`;

    constructor(private http: HttpClient) {
    }

    public onListSaiParameters = (clientFilterModel: GenericSearchRequestModel): Observable<any> =>
        this.http.post<any>(`${this.URL}/parametroSaiList`, clientFilterModel)

    public onFindByUser = (userId: number): Observable<UserParametrosSaiModel> =>
        this.http.post<UserParametrosSaiModel>(`${this.URL}/findByUser`, userId)

    public onFindByAgenda = (userId: number): Observable<UserParametrosSaiModel> =>
        this.http.post<UserParametrosSaiModel>(`${this.URL}/findByAgenda`, userId)

    public onSave = (saiParameterModel: UserParametrosSaiModel): Observable<UserParametrosSaiModel> =>
        this.http.post<UserParametrosSaiModel>(`${this.URL}/save`, saiParameterModel)

    public onMerge = (saiParameterModel: UserParametrosSaiModel): Observable<UserParametrosSaiModel> =>
        this.http.post<UserParametrosSaiModel>(`${this.URL}/update`, saiParameterModel)

    public onListTypeAccountByUser = (userDatosAdicionalesByTypeModelRequest: UserDatosAdicionalesByTypeModelRequest): Observable<Array<UserDatosAdicionalesModel>> =>
        this.http.post<Array<UserDatosAdicionalesModel>>(`${this.URL}/datosAdicionales/readByUser`, userDatosAdicionalesByTypeModelRequest)
}
