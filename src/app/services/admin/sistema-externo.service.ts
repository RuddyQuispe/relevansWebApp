import {Injectable} from '@angular/core';
import {Config} from '@services/config';
import {HttpClient} from '@angular/common/http';
import {SistemaExternoFilterModel, SistemaExternoModel} from '@models/sistema-externo';
import {Observable} from 'rxjs';
import {ResponseFilterModel} from '@models/response.filter.model';

@Injectable({
    providedIn: 'root'
})
export class SistemaExternoService {

    private readonly URL: string = `${Config.settings.path.url_root_hiper_vales}/api-hipervale/v1/sistema-externo`;

    constructor(private http: HttpClient) {
    }

    public onListByFilter = (sistemaExternoFilterModel: SistemaExternoFilterModel): Observable<ResponseFilterModel<SistemaExternoModel>> =>
        this.http.post<ResponseFilterModel<SistemaExternoModel>>(`${this.URL}/findByFilter`, sistemaExternoFilterModel)

    public onFindById = (sistemaExternoId: number): Observable<SistemaExternoModel> =>
        this.http.post<SistemaExternoModel>(`${this.URL}/findById`, sistemaExternoId)

    public onSave = (sistemaExternoModel: SistemaExternoModel): Observable<SistemaExternoModel> =>
        this.http.post<SistemaExternoModel>(`${this.URL}/save`, sistemaExternoModel)

    public onMerge = (sistemaExternoModel: SistemaExternoModel): Observable<SistemaExternoModel> =>
        this.http.put<SistemaExternoModel>(`${this.URL}/update`, sistemaExternoModel)

    public onSaveNewUserAccountExternalSystem = (sistemaExternoModel: SistemaExternoModel): Observable<SistemaExternoModel> =>
        this.http.post<SistemaExternoModel>(`${this.URL}/addNuevoUsuarioSistemaExterno`, sistemaExternoModel)
}
