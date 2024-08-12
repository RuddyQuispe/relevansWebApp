import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ConfirmationService, SelectItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {
    PerfilAutorizadorFilterModel,
    PerfilAutorizadorModel,
    RangosPorMontoVenta
} from "@models/perfil-autorizacion";
import {CONFIG} from "@config/config";
import {PerfilAutorizadorService} from "@services/admin/perfil-autorizador.service";
import {AuthService} from "@services/auth.service";
import {MensajeService} from "@app/error/mensaje.service";
import {ResponseFilterModel} from "@models/response.filter.model";
import {DIRECTION_ORDER_BY, OPTION_ALL, T_DOMAIN_TBZ} from "@app/utils/constants";
import {DomainService} from "@services/template/domain.service";
import {RequestHeaderModel} from "@models/requestHeader.model";
import {DomainModel, DomainModelRequestSingle, DomainModelResponseList} from "@models/domain";

@Component({
    selector: 'app-authorization-profile',
    templateUrl: './authorization-profile.component.html',
    styleUrls: ['./authorization-profile.component.scss']
})
export class AuthorizationProfileComponent implements OnInit, AfterViewInit {

    protected authorizationProfiles: Array<PerfilAutorizadorModel> = [];
    protected authorizationProfileFilter: PerfilAutorizadorFilterModel;
    protected authorizationProfileModel: PerfilAutorizadorModel;
    protected permissionAuthorizeProfile: RangosPorMontoVenta = new RangosPorMontoVenta();

    protected rowsTables: number = Number(CONFIG.ROWS_TABLE);
    protected sizeProfiles: number = 0;
    protected loading: boolean;
    // Attributes for authorizer profile registration modal
    protected isViewDialogAuthorizeProfile: boolean = false;
    protected displayDialogAuthorizeProfile: boolean = false;
    // modal for list of permissions of a profile
    protected displayDialogPermissionProfile: boolean;
    protected loadingPermissions: boolean;
    // modal to add permission range
    protected displayDialogPermissionAdd: boolean = false;
    protected titleAuthorizationPermission: string = AuthorizationProfileComponent.TITLE_PERMISSION.ADD_PERMISSION;
    protected currentTypesOptions: Array<SelectItem> = [];

    protected static readonly TITLE_PERMISSION: any = {
        ADD_PERMISSION: 'Agregar rango de venta',
        UPDATE_PERMISSION: 'Modificar rango de venta'
    };

    constructor(private profileAuthorizerService: PerfilAutorizadorService,
                private authService: AuthService,
                private domainService: DomainService,
                private translateService: TranslateService,
                private messageService: MensajeService,
                private confirmationService: ConfirmationService,
                private changeDetectorService: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        this.loadCurrentTypesOptions();
        this.initializeFilter();
    }

    public ngAfterViewInit(): void {
        this.changeDetectorService.detectChanges();
    }

    // #region ABM_SERVICES

    private loadCurrentTypesOptions(): void {
        this.domainService.onList(new DomainModelRequestSingle(new RequestHeaderModel(this.authService.getUser()),
            new DomainModel(T_DOMAIN_TBZ.CURRENT_TYPE))).subscribe({
            next: (response: DomainModelResponseList) => {
                this.currentTypesOptions.push(...response.domains.map((d: DomainModel) => {
                    return {label: d.domName, value: d.domValue, title: d.description};
                }).sort(((d, dc) => {
                    if (d.label < dc.label) return -1;
                    if (d.label > dc.label) return 1;
                    return 0;
                })));
            }
        });
    }

    private loadAuthorizationProfiles() {
        this.loading = true;
        this.profileAuthorizerService.onListByFilter(PerfilAutorizadorFilterModel.clone(this.authorizationProfileFilter)).subscribe({
            next: (response: ResponseFilterModel<PerfilAutorizadorModel>) => {
                this.authorizationProfiles = response.contenido;
                this.sizeProfiles = response.totalElementos;
                this.loading = false;
            },
            error: error => this.loading = false
        });
    }

    private findAuthorizationProfile(authorizationProfileId: number) {
        this.loadingPermissions = true;
        this.profileAuthorizerService.onFindById(authorizationProfileId).subscribe({
            next: (response: PerfilAutorizadorModel) => {
                this.authorizationProfileModel = response;
                this.loadingPermissions = false;
            },
            error: err => this.loadingPermissions = false
        });
    }


    private saveOrUpdateAuthorizationProfile(): void {
        this.loading = true;
        this.authorizationProfileModel.lastUser = this.authService.getUser();
        this.authorizationProfileModel.lastTime = new Date();
        const authorizationProfileObserver: Observable<PerfilAutorizadorModel> = this.authorizationProfileModel.perfilAutorizadorId ?
            this.profileAuthorizerService.onMerge(PerfilAutorizadorModel.clone(this.authorizationProfileModel)) :
            this.profileAuthorizerService.onSave(PerfilAutorizadorModel.clone(this.authorizationProfileModel));
        authorizationProfileObserver.subscribe({
            next: (response: PerfilAutorizadorModel) => {
                this.messageService.showSuccess(this.translateService.instant('succes'));
                this.loadAuthorizationProfiles();
                this.closeAuthorizationProfileDialog();
                this.loading = false;
            },
            error: err => this.loading = false
        });
    }

    private saveOrUpdateAuthorizationProfilePermission(): void {
        this.loadingPermissions = true;
        this.permissionAuthorizeProfile.perfilAutorizadorId = this.authorizationProfileModel.perfilAutorizadorId;
        this.permissionAuthorizeProfile.lastUser = this.authService.getUser();
        this.permissionAuthorizeProfile.lastTime = new Date();

        const authorizationProfilePermissionModel: RangosPorMontoVenta = RangosPorMontoVenta.clone(this.permissionAuthorizeProfile);

        const authorizationProfilePermissionObserver: Observable<RangosPorMontoVenta> =
            this.permissionAuthorizeProfile.rangoPorMontoVentaId ?
                this.profileAuthorizerService.onMergeAuthorizationProfilePermission(authorizationProfilePermissionModel) :
                this.profileAuthorizerService.onSaveAuthorizationProfilePermission(authorizationProfilePermissionModel);

        authorizationProfilePermissionObserver.subscribe({
            next: (response: RangosPorMontoVenta) => {
                this.messageService.showSuccess(this.translateService.instant('succes'));
                this.findAuthorizationProfile(response.perfilAutorizadorId);
                this.loadingPermissions = false;
                this.displayDialogPermissionAdd = false;
            },
            error: err => {
                this.loadingPermissions = false;
                this.displayDialogPermissionAdd = false;
            }
        });
    }

    // #endregion ABM_SERVICES

    // #region EVENTS

    protected onChangePageTableProfiles(event: any): void {
        this.authorizationProfileFilter.page = event.first / this.rowsTables;
        this.authorizationProfileFilter.direction = !event.sortField? DIRECTION_ORDER_BY.DESC: (event.sortOrder > 0 ? DIRECTION_ORDER_BY.ASC : DIRECTION_ORDER_BY.DESC);
        this.authorizationProfileFilter.orderBy = event.sortField ?? PerfilAutorizadorModel.PERFIL_AUTORIZADOR_ID_PROPERTY;
        this.authorizationProfileFilter.nombre = event.globalFilter;
        console.log('CHANGE PAGE:', this.authorizationProfileFilter);
        this.loadAuthorizationProfiles();
    }

    protected onClickShowAddAuthorizationProfile(): void {
        this.isViewDialogAuthorizeProfile = false;
        this.authorizationProfileModel = new PerfilAutorizadorModel();
        this.displayDialogAuthorizeProfile = true;
    }

    protected onClickShowDialogToEdit(event: MouseEvent, authorizationProfile: PerfilAutorizadorModel): void {
        this.displayDialogAuthorizeProfile = true;
        this.isViewDialogAuthorizeProfile = false;
        this.findAuthorizationProfile(authorizationProfile.perfilAutorizadorId);
        event.preventDefault();
    }

    protected onClickShowDialogToView(event: MouseEvent, authorizationProfileModel: PerfilAutorizadorModel): void {
        this.displayDialogAuthorizeProfile = true;
        this.isViewDialogAuthorizeProfile = true;
        this.findAuthorizationProfile(authorizationProfileModel.perfilAutorizadorId);
        event.preventDefault();
    }

    protected onClickShowDialogToManagePermissions(event: MouseEvent, authorizationProfile: PerfilAutorizadorModel): void {
        this.displayDialogPermissionProfile = true;
        this.permissionAuthorizeProfile = new RangosPorMontoVenta();
        this.findAuthorizationProfile(authorizationProfile.perfilAutorizadorId);
        event.preventDefault();
    }

    protected onClickCloseDialogAuthorizationProfile(): void {
        this.closeAuthorizationProfileDialog();
    }

    protected onSubmitAuthorizationProfile(): void {
        this.confirmationService.confirm({
            header: this.translateService.instant('authorization_profile_title'),
            message: this.authorizationProfileModel.perfilAutorizadorId == undefined ?
                this.translateService.instant('authorization_profile_confirm_save_desc') :
                this.translateService.instant('authorization_profile_confirm_update_desc'),
            icon: 'pi pi-times-circle',
            accept: () => this.saveOrUpdateAuthorizationProfile()
        });
    }

    protected onClickCloseDialogPermissionProfile(): void {
        this.closeManagePermissionsDialog();
    }

    protected onSubmitPermissionProfile(): void {
        this.confirmationService.confirm({
            header: this.translateService.instant('authorization_profile_permission_title'),
            message: this.permissionAuthorizeProfile.rangoPorMontoVentaId ?
                this.translateService.instant('authorization_profile_permission_confirm_update_desc') :
                this.translateService.instant('authorization_profile_permission_confirm_save_desc'),
            icon: 'pi pi-times-circle',
            accept: () => this.saveOrUpdateAuthorizationProfilePermission()
        });
    }

    protected onClickEditPermissionProfile(permissionProfile: RangosPorMontoVenta): void {
        debugger;
        this.permissionAuthorizeProfile = RangosPorMontoVenta.clone(permissionProfile);
        this.titleAuthorizationPermission = AuthorizationProfileComponent.TITLE_PERMISSION.UPDATE_PERMISSION;
        this.displayDialogPermissionAdd = true;
    }

    // #endregion EVENTS

    // #region EXTERNAL_FUNCTIONS

    private initializeFilter() {
        this.authorizationProfileFilter = new PerfilAutorizadorFilterModel(
            PerfilAutorizadorModel.PERFIL_AUTORIZADOR_ID_PROPERTY,
            DIRECTION_ORDER_BY.DESC,
            0,
            this.rowsTables,
            null
        );
    }

    private closeAuthorizationProfileDialog(): void {
        this.displayDialogAuthorizeProfile = false;
        this.authorizationProfileModel = null;
    }

    private closeManagePermissionsDialog(): void {
        this.displayDialogPermissionProfile = false;
        this.authorizationProfileModel = null;
    }

    // #endregion EXTERNAL_FUNCTIONS
    protected onClickAddAuthorizationRange() {
        this.permissionAuthorizeProfile = new RangosPorMontoVenta();
        this.titleAuthorizationPermission = AuthorizationProfileComponent.TITLE_PERMISSION.ADD_PERMISSION;
        this.displayDialogPermissionAdd = true;
    }

    protected onClickCloseDisplayDialogPermissionAdd(): void {
        this.displayDialogPermissionAdd = false;
    }

    protected onSubmitDisplayDialogPermissionAdd(): void {
        this.confirmationService.confirm({
            header: this.titleAuthorizationPermission === AuthorizationProfileComponent.TITLE_PERMISSION.ADD_PERMISSION ?
                this.translateService.instant('authorization_profile_permission_btn_add') :
                this.translateService.instant('authorization_profile_permission_btn_update'),
            message: this.titleAuthorizationPermission === AuthorizationProfileComponent.TITLE_PERMISSION.ADD_PERMISSION ?
                this.translateService.instant('authorization_profile_permission_confirm_save_desc') :
                this.translateService.instant('authorization_profile_permission_confirm_update_desc'),
            icon: 'pi pi-times-circle',
            accept: () => this.saveOrUpdateAuthorizationProfilePermission()
        });
    }
}
