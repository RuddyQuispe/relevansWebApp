import {Injectable} from '@angular/core';
import {Config} from "@services/config";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseFilterModel} from "@models/response.filter.model";
import {MenuApiFilterModel, MenuApiModel} from "@models/menu-api";

@Injectable({
    providedIn: 'root'
})
export class MenuApiService {

    private readonly URL: string = `${Config.settings.path.url_root_hiper_vales}/api-hipervale/v1/menu-api`;

    constructor(private http: HttpClient) {
    }

    public onListByFilter = (menuFilterModel: MenuApiFilterModel): Observable<ResponseFilterModel<MenuApiModel>> =>
        this.http.post<ResponseFilterModel<MenuApiModel>>(`${this.URL}/findByFilter`, menuFilterModel)

    public onFindById = (menuId: number): Observable<MenuApiModel> =>
        this.http.post<MenuApiModel>(`${this.URL}/findById`, menuId)

    public onSave = (menuModel: MenuApiModel): Observable<MenuApiModel> =>
        this.http.post<MenuApiModel>(`${this.URL}/save`, menuModel)


    public onMerge = (menuModel: MenuApiModel): Observable<MenuApiModel> =>
        this.http.put<MenuApiModel>(`${this.URL}/update`, menuModel)
}
