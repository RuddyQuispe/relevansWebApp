import {Component, OnInit} from '@angular/core';
import {UserService} from '@services/template/user.service';
import {AuthService} from '@services/auth.service';
import {SelectItem} from 'primeng/api';
import {MensajeService} from '@app/error/mensaje.service';
import {ProfileService} from '@services/template/profile.service';
import {TranslateService} from '@ngx-translate/core';
import {UserModel, UserModelRequestSingle, UserModelResponseSingle, UserModelResponseList} from '@app/model/user';
import {RequestHeaderModel} from '@app/model/requestHeader.model';
import {
    ProfileModel,
    ProfileModelRequestList,
    ProfileModelResponseList
} from '@app/model/profile';
import {ItemsModel} from '@app/model/util/items.model';
import {CONFIG} from '@config/config';
import {PerfilAutorizadorService} from "@services/admin/perfil-autorizador.service";
import {UserParametrosSaiModel} from "@models/parametros-sai";
import {ResponseFilterModel} from "@models/response.filter.model";
import {PerfilAutorizadorFilterModel, PerfilAutorizadorModel} from "@models/perfil-autorizacion";
import {ParametrosSaiService} from "@services/admin/parametros-sai.service";

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
    public rowsTables: number = Number(CONFIG.ROWS_TABLE);
    public list: Array<UserModel> = [];
    public entity: UserModel;
    public entitySelect: UserModel;
    public entityFilter: UserModel;
    public displayDialog: boolean;
    public isView: boolean;
    public submitted = false;
    public profiles: Array<ProfileModel>;
    public profilesDropDownList: ItemsModel[] = [];

    public isAdm: boolean;
    public loading = false;
    public companyId = null;


    constructor(
        private userService: UserService,
        private authService: AuthService,
        private profileService: ProfileService,
        private translate: TranslateService,
        private mensajeService: MensajeService
    ) {
        this.initModels();
    }

    initModels() {
        this.profiles = new Array<ProfileModel>();
    }

    public ngOnInit() {
        this.clearFilter();
        this.listProfiles();
    }

    clearFilter() {
        this.entityFilter = new UserModel();
    }

    filtrar() {
        this.loading = true;
        this.list = [];
        const userModel1 = new UserModelRequestSingle(
            new RequestHeaderModel(this.authService.getUser()), this.entityFilter);
        this.userService.list(userModel1).subscribe({
            next:
                (data: UserModelResponseList) => {
                    this.loading = false;
                    const aux = data.users;
                    aux.forEach((userModel: UserModel): void => {
                        userModel.profile = this.profiles.find(
                            (profileModel: ProfileModel) => profileModel.profileId === userModel.profileId).name;
                    });
                    this.list = aux;
                },
            error: error => {
                this.loading = false;
            }
        });
    }

    private listProfiles(): void {
        const header = new RequestHeaderModel(this.authService.getUser());
        const profileDto = new ProfileModel();
        const profileModel1 = new ProfileModelRequestList(header, profileDto);
        this.profileService.list(profileModel1).subscribe(
            (data: ProfileModelResponseList) => {
                this.profiles = data.profiles;
                this.setValueProfiles();
                this.filtrar();
            }
        );
    }

    private setValueProfiles() {
        this.profilesDropDownList = [];
        let auxList = this.profiles.filter(x => x.description != null);
        auxList = auxList.filter(x => x.dashboard === true/* this.entity._interno */);

        const im: ItemsModel = new ItemsModel();
        this.profilesDropDownList.push(new ItemsModel().nuevo(this.translate.instant('selectList'), ''));
        auxList.forEach(function (element) {
            this.profilesDropDownList.push(im.profileToItem(element));
        }.bind(this));
    }

    private find(user: UserModel) {
        this.submitted = true;
        this.entity = null;
        const header = new RequestHeaderModel(this.authService.getUser());
        const userRequest = new UserModelRequestSingle(header, user);

        this.userService.find(userRequest).subscribe({
            next: (data: UserModelResponseSingle) => {
                /* if (this.entity.localAccess === 1) {
                    //this.entity._interno = false;
                } else {
                    //this.entity._interno = true;
                } */

                // this.setValueProfiles();
                this.entity = data.user;
                this.submitted = false;
                this.displayDialog = true;
            },
            error: error => {
                this.submitted = false;
            }
        });
    }

    showDialogToAdd() {
        this.isView = false;
        this.entity = new UserModel();
        this.entity.ldapAccess = false;
        // this.entity._interno = false;
        this.displayDialog = true;

        // this.setValueProfiles();
    }

    showDialogToEdit(event: Event, enty: UserModel) {
        this.isView = false;
        this.find(enty);
        event.preventDefault();
    }

    showDialogToView(event: Event, enty: UserModel) {
        this.isView = true;
        this.find(enty);
        event.preventDefault();
    }

    onSubmit() {
        this.save(new UserModel().clone(this.entity));
    }

    save(user: UserModel) {
        this.submitted = true;
        const header = new RequestHeaderModel(this.authService.getUser());
        const userClone = new UserModel().clone(user);
        const userModelRequest = new UserModelRequestSingle(header, user);
        // console.log('REQUEST::', userModelRequest);

        userModelRequest.user.lastTime = new Date();
        userModelRequest.user.lastUser = header.user;
        if (user.userId > 0) {
            this.userService.merge(userModelRequest).subscribe({
                next: (response: UserModelResponseSingle) => {
                    this.submitted = false;
                    this.mensajeService.showSuccess(this.translate.instant('succes'));
                    this.displayDialog = false;
                    this.entity = null;
                    this.filtrar();
                },
                error: error => {
                    this.submitted = false;
                }
            });
        } else {
            // @ts-ignore
            userModelRequest.user = {
                ...userModelRequest.user,
                accessType: 'Interno',
                companyId: this.companyId ? this.companyId : userModelRequest.user.companyId,
                inactive: false,
                lastLoginDate: new Date('2000-01-01')
            };
            this.userService.save(userModelRequest).subscribe({
                next: (data: UserModelResponseSingle) => {
                    this.submitted = false;
                    this.mensajeService.showSuccess(this.translate.instant('succes'));
                    this.displayDialog = false;
                    this.entity = null;
                    this.filtrar();
                },
                error: error => {
                    this.submitted = false;
                }
            });
        }
    }

    close() {
        this.displayDialog = false;
        this.submitted = false;
    }

    loadClearingHouseDropDownList(profiles: Array<ProfileModel>) {
        this.profilesDropDownList = profiles.map((profileModel: ProfileModel) => new ItemsModel().profileToItem(profileModel));
    }
}
