import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
    PerfilAutorizadorFilterModel,
    PerfilAutorizadorModel,
    RangosPorMontoVenta
} from '@models/perfil-autorizacion';
import {Config} from "@services/config";
import {ResponseFilterModel} from "@models/response.filter.model";

@Injectable({
    providedIn: 'root'
})
export class PerfilAutorizadorService {

    private readonly URL: string = `${Config.settings.path.url_root_hiper_vales}/api-hipervale/v1/perfil-autorizador`;

    constructor(private http: HttpClient) {
    }

    public onListByFilter = (profileAuthorizerFilter: PerfilAutorizadorFilterModel)
        : Observable<ResponseFilterModel<PerfilAutorizadorModel>> =>
        this.http.post<ResponseFilterModel<PerfilAutorizadorModel>>(`${this.URL}/findByFilter`,
            profileAuthorizerFilter)

    public onFindById = (profileAuthorizerId: number): Observable<PerfilAutorizadorModel> =>
        this.http.post<PerfilAutorizadorModel>(`${this.URL}/findById`, profileAuthorizerId)

    public onSave = (perfilAutorizadorModel: PerfilAutorizadorModel): Observable<PerfilAutorizadorModel> =>
        this.http.post<PerfilAutorizadorModel>(`${this.URL}/save`, perfilAutorizadorModel)


    public onMerge = (perfilAutorizadorModel: PerfilAutorizadorModel): Observable<PerfilAutorizadorModel> =>
        this.http.put<PerfilAutorizadorModel>(`${this.URL}/update`, perfilAutorizadorModel)

    public onSaveAuthorizationProfilePermission = (authorizationProfilePermissionModel: RangosPorMontoVenta)
        : Observable<RangosPorMontoVenta> =>
        this.http.post<RangosPorMontoVenta>(`${this.URL}/savePerfilAutorizadoPermiso`, authorizationProfilePermissionModel)

    public onMergeAuthorizationProfilePermission = (authorizationProfilePermissionModel: RangosPorMontoVenta)
        : Observable<RangosPorMontoVenta> =>
        this.http.put<RangosPorMontoVenta>(`${this.URL}/updatePerfilAutorizadoPermiso`, authorizationProfilePermissionModel)
}
