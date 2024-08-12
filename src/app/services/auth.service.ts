import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthModel, AuthModelRequest, AuthModelResponse, ValidModel1, ValidModel2} from '@app/model/auth';
import {StorageUtil} from '@app/model/util';
import {LOCSESION} from '@config/config';
import {Config} from '@services/config';
import {RequestHeaderModel} from '@app/model/requestHeader.model';
import {ItemsModelMenu} from '@app/model/util/items.model.menu';
import {Router} from '@angular/router';
import {AccessModel} from '@app/model/access';
import {ChangePasswordResponseModel, ChangePasswordRequestModel} from '@models/password';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    redirectUrl: string;
    private currentUserSubject: BehaviorSubject<AuthModel>;
    public currentUser: Observable<AuthModel>;
    public menu: ItemsModelMenu[];

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.currentUserSubject = new BehaviorSubject<AuthModel>(JSON.parse(StorageUtil.get(LOCSESION.LS_CURRENT_USER)));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): AuthModel {
        return this.currentUserSubject.value;
    }

    login(r1: AuthModelRequest) {
        const url: string = `${Config.settings.path.url_root_admin}/ws-login-tbz/v1/login`;
        return this.http.post<AuthModelResponse>(url, r1);
    }

    sendPasswordRequest(request: ChangePasswordRequestModel) {
        return this.http.post<ChangePasswordResponseModel>(
            `${Config.settings.path.url_root_admin}/ws-login-tbz/v1/reset_password_request`, request);
    }

    updateToken(neoTk: string) {
        const currentUser = JSON.parse(StorageUtil.get(LOCSESION.LS_CURRENT_USER));
        if (currentUser == null) {
            this.logout();
            return;
        }
        currentUser.token = neoTk;

        StorageUtil.set(LOCSESION.LS_CURRENT_USER, JSON.stringify(currentUser));
        this.currentUserSubject.next(currentUser);
    }

    validateSession() {
        const header = new RequestHeaderModel(this.getUser());
        const validModel1 = new ValidModel1(header, this.router.url);
        return this.http.post<ValidModel2>(`${Config.settings.path.url_root_admin}/ws-login-tbz/v1/validateSession`, validModel1);
    }

    public setUser(authModel1: AuthModelRequest, authModel2: AuthModelResponse) {
        const authModel = new AuthModel();
        authModel.user = authModel1.header.user;
        authModel.name = authModel2.name;
        authModel.token = authModel2.jwtToken;
        authModel.menu = this.menu;
        authModel.rol = authModel2.rol;
        authModel.language = authModel2.language;
        authModel.companyId = authModel2.companyId;
        authModel.userId = authModel2.userId;

        StorageUtil.set(LOCSESION.LS_CURRENT_USER, JSON.stringify(authModel));
        this.currentUserSubject.next(authModel);
    }

    getAuthorizationToken() {
        const currentUser = JSON.parse(StorageUtil.get(LOCSESION.LS_CURRENT_USER));
        if (currentUser == null) {
            this.logout();
            return;
        }
        return currentUser.token;
    }

    public getUser() {
        const currentUser = JSON.parse(StorageUtil.get(LOCSESION.LS_CURRENT_USER));
        if (currentUser == null) {
            this.logout();
            return;
        }
        return currentUser.user;
    }

    public getName() {
        const currentUser = JSON.parse(StorageUtil.get(LOCSESION.LS_CURRENT_USER));
        if (currentUser == null) {
            this.logout();
            return;
        }
        return currentUser.name;
    }

    public getCompanyId() {
        const currentUser = JSON.parse(StorageUtil.get(LOCSESION.LS_CURRENT_USER));
        if (currentUser == null) {
            this.logout();
            return;
        }
        return currentUser.companyId;
    }

    public getUserId() {
        const currentUser = JSON.parse(StorageUtil.get(LOCSESION.LS_CURRENT_USER));
        if (currentUser == null) {
            this.logout();
            return;
        }
        return currentUser.userId;
    }

    public getLanguage() {
        const currentUser = JSON.parse(StorageUtil.get(LOCSESION.LS_CURRENT_USER));
        if (currentUser == null) {
            this.logout();
            return;
        }
        return currentUser.language;
    }

    loadMenu(access: AccessModel[]) {
        const itModMenu = new ItemsModelMenu();
        access = access.filter(item => item.name !== 'public_user');
        this.menu = itModMenu.accessToItem(access);
    }


    logout() {
        StorageUtil.remove(LOCSESION.LS_CURRENT_USER);
        console.log('SE HIZO LOGOUT');
        this.currentUserSubject.next(null);
    }
}
