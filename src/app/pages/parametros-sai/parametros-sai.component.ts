import {Component, OnInit} from '@angular/core';
import {CONFIG} from '@config/config';
import {UserParametrosSaiModel} from 'app/model/parametros-sai';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {SEARCH_TYPE, T_DOMAIN_NAME} from '@app/utils/constants';
import {GenericSearchResponseModel} from '@models/generic-response';
import {UserDatosAdicionalesModel} from '@models/unidad-negocio';
import {ParametrosSaiService} from '@services/admin/parametros-sai.service';
import {MensajeService} from '@app/error/mensaje.service';
import {ConfirmationService} from 'primeng/api';
import {AuthService} from '@services/auth.service';
import {UserService} from '@services/template/user.service';
import {UserModel, UserModelRequestSingle, UserModelResponseList} from '@models/user';
import {RequestHeaderModel} from '@models/requestHeader.model';
import {Observable} from 'rxjs';
import {PerfilAutorizadorFilterModel, PerfilAutorizadorModel} from "@models/perfil-autorizacion";
import {PerfilAutorizadorService} from "@services/admin/perfil-autorizador.service";
import {ResponseFilterModel} from "@models/response.filter.model";
import {ItemsModel} from "@models/util";

@Component({
    selector: 'app-parametros-sai',
    templateUrl: './parametros-sai.component.html',
    styleUrls: ['./parametros-sai.component.scss']
})
export class ParametrosSaiComponent implements OnInit {

    public saiParametersModel: UserParametrosSaiModel;

    public rowsTables: number = Number(CONFIG.ROWS_TABLE);
    public loading: boolean;
    public submited: boolean;
    public cmpReq: string;
    public cmpMin: string;
    public isVisibleDialogGeneric: boolean;
    public titleDialog: string;
    public SEARCH_TYPE_PARAM: SEARCH_TYPE;
    public genericParamToSearch: GenericSearchResponseModel;
    protected authorizationProfilesOptions: Array<any>;
    protected readonly SEARCH_TYPE = SEARCH_TYPE;
    private isNewData: boolean;

    constructor(private router: Router,
                private translateService: TranslateService,
                private saiParametersService: ParametrosSaiService,
                private messageService: MensajeService,
                private confirmationService: ConfirmationService,
                private authService: AuthService,
                private userService: UserService,
                private authorizationProfileService: PerfilAutorizadorService) {
        this.loading = false;
        this.submited = false;
        this.isNewData = false;
        this.cmpReq = this.translateService.instant('cmpReq');
        this.cmpMin = this.translateService.instant('cmpMin');
        this.saiParametersModel = new UserParametrosSaiModel();
        this.authorizationProfilesOptions = new Array<ItemsModel>();

        this.isVisibleDialogGeneric = false;
        this.titleDialog = '';
        this.genericParamToSearch = new GenericSearchResponseModel();
    }

    public ngOnInit(): void {
        const userRequest: UserModel = new UserModel(null, this.authService.getUserId());
        this.assignUserInfo(userRequest);
        this.loadAuthorizationProfiles();
    }

    // #region ABM_SERVICES
    private loadUserParamSAIData(userId: number): void {
        if (!userId) {
            this.messageService.showError(this.translateService.instant('sai_parameters_error_not_found'));
            return;
        }
        this.saiParametersService.onFindByUser(userId).subscribe({
            next: (response: UserParametrosSaiModel) => {
                if (!response.usuarioId)
                    this.messageService.showError(this.translateService.instant('sai_parameters_error_not_found'));
                // IS_NEW_DATA: PARA VERIFICAR SI SE VA A CRAR O MODIFICAR LOS PARAMETROS SAI
                this.isNewData = response.usuarioId !== this.saiParametersModel.usuarioId;

                const usuarioIdDesc: string = this.saiParametersModel.usuarioIdDesc;
                const usuarioId: number = this.saiParametersModel.usuarioId;
                this.saiParametersModel = UserParametrosSaiModel.clone(response);
                this.saiParametersModel.usuarioIdDesc = usuarioIdDesc;
                this.saiParametersModel.usuarioId = usuarioId;
                if (!this.saiParametersModel.userUnidadNegocioDtoList)
                    this.saiParametersModel.userUnidadNegocioDtoList = [];
            }
        });
    }

    private assignUserInfo(userInfo: UserModel): void {
        this.userService.list(new UserModelRequestSingle(
            new RequestHeaderModel(this.authService.getUser()), userInfo)).subscribe({
            next: (response: UserModelResponseList) => {
                this.saiParametersModel.usuarioId = response.users[0]?.userId ?? null;
                this.saiParametersModel.usuarioIdDesc = response.users[0]?.userName ?? '';
                this.loadUserParamSAIData(this.saiParametersModel.usuarioId);
            }
        });
    }

    private saveSaiParameters() {
        const saiParameterResponseObserver: Observable<UserParametrosSaiModel> = this.isNewData ?
            this.saiParametersService.onSave(this.saiParametersModel) :
            this.saiParametersService.onMerge(this.saiParametersModel);

        saiParameterResponseObserver.subscribe({
            next: (response: UserParametrosSaiModel) => {
                const userName: string = this.saiParametersModel.usuarioIdDesc;
                this.saiParametersModel = response;
                this.saiParametersModel.usuarioIdDesc = userName;
                this.messageService.showSuccess(this.translateService.instant('sai_parameters_confirmation_message'));
            }
        });
    }

    private loadAuthorizationProfiles() {
        this.authorizationProfileService.onListByFilter(new PerfilAutorizadorFilterModel()).subscribe({
            next: (response: ResponseFilterModel<PerfilAutorizadorModel>) => {
                this.authorizationProfilesOptions = [{
                    label: this.translateService.instant('selectList'),
                    value: null
                }];
                this.authorizationProfilesOptions.push(...response.contenido.map(p => {
                    return {
                        label: p.nombre,
                        value: p.perfilAutorizadorId
                    }
                }));
            }
        })
    }

    // #endregion ABM_SERVICES

    // #region TYPE_CxC

    public onClickOpenDialogFindCxCType(): void {
        this.genericParamToSearch = new GenericSearchResponseModel(null, null);
        this.SEARCH_TYPE_PARAM = SEARCH_TYPE.TYPE_CXC;
        this.titleDialog = this.translateService.instant('shared_dialog_find_type_cxc_header');
        this.isVisibleDialogGeneric = true;
    }

    public onClickCleanCxCType(): void {
        // TODO: QUITAR FUNCION
        // this.saiParametersModel.tipoCxC = null;
        // this.saiParametersModel.tipoCxCDesc = '';
    }

    public eventSelectCxCType(event: GenericSearchResponseModel): void {
        const existsCxCTypeInList: boolean = this.saiParametersModel.tipoCxCDtoList.some(cxc =>
            cxc.codigoSai === event.codigo.toString() && cxc.descripcion === event.descripcion);
        if (existsCxCTypeInList) {
            this.messageService.showError(this.translateService.instant('sai_parameters_duplicate_type_cxc'));
            return;
        }
        this.saiParametersModel.tipoCxCDtoList.push(
            new UserDatosAdicionalesModel(
                event.codigo.toString(),
                event.descripcion,
                null,
                this.saiParametersModel.usuarioId,
                T_DOMAIN_NAME.TIPO_CXC));
    }

    private removeTipoCxC(tipoCxC: UserDatosAdicionalesModel): void {
        const indexItemToRemove: number = this.saiParametersModel.tipoCxCDtoList.indexOf(tipoCxC);
        if (indexItemToRemove !== -1)
            this.saiParametersModel.tipoCxCDtoList.splice(indexItemToRemove, 1);
        else
            this.messageService.showError(this.translateService.instant('sai_parameters_error_not_fund_to_remove_cxc_type'));
    }

    // #endregion TYPE_CxC

    // #region TYPE_CxP

    public onClickOpenDialogFindCxPType(): void {
        this.genericParamToSearch = new GenericSearchResponseModel(
            this.saiParametersModel.tipoCxP,
            this.saiParametersModel.tipoCxPDesc);
        this.SEARCH_TYPE_PARAM = SEARCH_TYPE.TYPE_CXP;
        this.titleDialog = this.translateService.instant('shared_dialog_find_type_cxp_header');
        this.isVisibleDialogGeneric = true;
    }

    public onClickCleanCxPType(): void {
        this.saiParametersModel.tipoCxP = null;
        this.saiParametersModel.tipoCxPDesc = '';
    }


    public eventSelectCxPType(event: GenericSearchResponseModel): void {
        this.saiParametersModel.tipoCxP = event.codigo;
        this.saiParametersModel.tipoCxPDesc = event.descripcion;
    }

    // #endregion TYPE_CxP

    // #region APPLICATION_CxC

    public onClickOpenDialogFindCxCApplication(): void {
        this.genericParamToSearch = new GenericSearchResponseModel(
            this.saiParametersModel.aplicacionCxC,
            this.saiParametersModel.aplicacionCxCDesc);
        this.SEARCH_TYPE_PARAM = SEARCH_TYPE.APPLICATION_CXC;
        this.titleDialog = this.translateService.instant('shared_dialog_find_application_cxc_header');
        this.isVisibleDialogGeneric = true;
    }

    public onClickCleanCxCApplication(): void {
        this.saiParametersModel.aplicacionCxC = null;
        this.saiParametersModel.aplicacionCxCDesc = '';
    }

    public eventSelectCxCApplication(event: GenericSearchResponseModel) {
        this.saiParametersModel.aplicacionCxC = event.codigo;
        this.saiParametersModel.aplicacionCxCDesc = event.descripcion;
    }

    // #endregion APPLICATION_CxC
    // #region APPLICATION_CxP


    public onClickOpenDialogFindApplicationCxP(): void {
        this.genericParamToSearch = new GenericSearchResponseModel(
            this.saiParametersModel.aplicacionCxP,
            this.saiParametersModel.aplicacionCxPDesc);
        this.SEARCH_TYPE_PARAM = SEARCH_TYPE.APPLICATION_CXP;
        this.titleDialog = this.translateService.instant('shared_dialog_find_application_cxp_header');
        this.isVisibleDialogGeneric = true;
    }

    public onClickCleanApplicationCxP(): void {
        this.saiParametersModel.aplicacionCxP = null;
        this.saiParametersModel.aplicacionCxPDesc = '';
    }

    public eventSelectCxPApplication(event: GenericSearchResponseModel) {
        this.saiParametersModel.aplicacionCxP = event.codigo;
        this.saiParametersModel.aplicacionCxPDesc = event.descripcion;
    }

    // #endregion APPLICATION_CxP
    // #region VIA_PxC_VALE

    public onClickOpenDialogFindViaPxCDeVale(): void {
        this.genericParamToSearch = new GenericSearchResponseModel(
            this.saiParametersModel.viaPagoxConsumo,
            this.saiParametersModel.viaPagoxConsumoDesc);
        this.SEARCH_TYPE_PARAM = SEARCH_TYPE.VIA_PAGO_X_CONSUMO_DE_VALE;
        this.titleDialog = this.translateService.instant('shared_dialog_find_via_pxc_vale_header');
        this.isVisibleDialogGeneric = true;
    }

    public onClickCleanViaPxCDeVale(): void {
        this.saiParametersModel.viaPagoxConsumo = null;
        this.saiParametersModel.viaPagoxConsumoDesc = '';
    }

    public eventSelectViaPxCVale(event: GenericSearchResponseModel) {
        this.saiParametersModel.viaPagoxConsumo = event.codigo;
        this.saiParametersModel.viaPagoxConsumoDesc = event.descripcion;
    }

    // #endregion VIA_PxC_VALE
    // #region VIA_CxD

    public onClickOpenDialogFindViaCxD(): void {
        this.genericParamToSearch = new GenericSearchResponseModel(
            this.saiParametersModel.viaCobroxDescuento,
            this.saiParametersModel.viaCobroxDescuentoDesc);
        this.SEARCH_TYPE_PARAM = SEARCH_TYPE.VIA_COBRO_X_DESCUENTO;
        this.titleDialog = this.translateService.instant('shared_dialog_find_via_cxd_header');
        this.isVisibleDialogGeneric = true;
    }

    public onClickCleanViaCxD(): void {
        this.saiParametersModel.viaCobroxDescuento = null;
        this.saiParametersModel.viaCobroxDescuentoDesc = '';
    }

    public eventSelectViaCxD(event: GenericSearchResponseModel): void {
        this.saiParametersModel.viaCobroxDescuento = event.codigo;
        this.saiParametersModel.viaCobroxDescuentoDesc = event.descripcion;
    }

    // #endregion VIA_CxD

    // #region VIA_PAGO_X_CASTIGO
    public onClickOpenDialogFindViaPxCastigo(): void {
        this.genericParamToSearch = new GenericSearchResponseModel(
            this.saiParametersModel.viaPagoxCastigo,
            this.saiParametersModel.viaPagoxCastigoDesc);
        this.SEARCH_TYPE_PARAM = SEARCH_TYPE.VIA_PAGO_X_CASTIGO;
        this.titleDialog = this.translateService.instant('shared_dialog_find_via_pxcastigo_header');
        this.isVisibleDialogGeneric = true;
    }

    public onClickCleanViaPxCastigo(): void {
        this.saiParametersModel.viaPagoxCastigo = null;
        this.saiParametersModel.viaPagoxCastigoDesc = '';
    }

    public eventSelectViaPxCastigo(event: GenericSearchResponseModel): void {
        this.saiParametersModel.viaPagoxCastigo = event.codigo;
        this.saiParametersModel.viaPagoxCastigoDesc = event.descripcion;
    }

    // #endregion VIA_PAGO_X_CASTIGO

    // #region USER_CODE_SAI
    public onClickOpenDialogFindCodeUserSAI(): void {
        this.genericParamToSearch = new GenericSearchResponseModel(
            this.saiParametersModel.codigoUsuarioSai || null,
            this.saiParametersModel.codigoUsuarioSaiDesc);
        this.SEARCH_TYPE_PARAM = SEARCH_TYPE.AGENDA;
        this.titleDialog = this.translateService.instant('shared_dialog_find_user_code_sai_header');
        this.isVisibleDialogGeneric = true;
    }

    public onClickCleanUserCodeSai(): void {
        this.saiParametersModel.codigoUsuarioSai = null;
        this.saiParametersModel.codigoUsuarioSaiDesc = '';
    }

    private eventSelectUserCodeSAI(event: GenericSearchResponseModel) {
        this.saiParametersModel.codigoUsuarioSai = Number(event.codigo);
        this.saiParametersModel.codigoUsuarioSaiDesc = event.descripcion;
    }

    // #endregion USER_CODE_SAI

    // #region BUSINESS_UNIT
    private eventSelectBusinessUnit(event: GenericSearchResponseModel) {
        const businessUnitClone: UserDatosAdicionalesModel = this.saiParametersModel.userUnidadNegocioDtoList.find(u =>
            u.codigoSai === event.codigo.toString() && u.descripcion === event.descripcion);
        if (businessUnitClone) {
            this.messageService.showError(this.translateService.instant('sai_parameters_duplicate_business_unit'));
            return;
        }
        this.saiParametersModel.userUnidadNegocioDtoList.push(
            new UserDatosAdicionalesModel(
                event.codigo.toString(),
                event.descripcion,
                null,
                this.saiParametersModel.usuarioId,
                T_DOMAIN_NAME.UNIDAD_NEGOCIO
                ));
    }

    private removeBusinessUnit(businessUnit: UserDatosAdicionalesModel) {
        const indexItemToRemove: number = this.saiParametersModel.userUnidadNegocioDtoList.indexOf(businessUnit);
        if (indexItemToRemove !== -1)
            this.saiParametersModel.userUnidadNegocioDtoList.splice(indexItemToRemove, 1);
        else
            this.messageService.showError(this.translateService.instant('sai_parameters_error_not_fund_to_remove'));
    }

    // #endregion BUSINESS_UNIT
    // #region SYSTEM_USER
    public onClickOpenDialogFindCodeUserSystem(): void {
        this.genericParamToSearch = new GenericSearchResponseModel(
            this.saiParametersModel.usuarioId || null,
            this.saiParametersModel.usuarioIdDesc);
        this.SEARCH_TYPE_PARAM = SEARCH_TYPE.SYSTEM_USER;
        this.titleDialog = this.translateService.instant('shared_dialog_find_user_code_system_header');
        this.isVisibleDialogGeneric = true;
    }

    private eventSelectCodeUserSystem(event: GenericSearchResponseModel) {
        this.saiParametersModel.usuarioId = Number(event.codigo);
        this.saiParametersModel.usuarioIdDesc = event.descripcion;
        this.loadUserParamSAIData(this.saiParametersModel.usuarioId);
    }

    // #endregion SYSTEM_USER

    // #region EVENTS
    public eventCloseDialogGeneric(event: boolean): void {
        if (event) {
            this.isVisibleDialogGeneric = false;
            this.genericParamToSearch = new GenericSearchResponseModel();
        }
    }

    public eventSelectDialogResponse(event: GenericSearchResponseModel) {
        switch (this.SEARCH_TYPE_PARAM) {
            case SEARCH_TYPE.SYSTEM_USER:
                this.eventSelectCodeUserSystem(event);
                break;
            case SEARCH_TYPE.AGENDA:
                this.eventSelectUserCodeSAI(event);
                break;
            case SEARCH_TYPE.UNIDAD_NEGOCIO:
                this.eventSelectBusinessUnit(event);
                break;
            case SEARCH_TYPE.TYPE_CXC:
                this.eventSelectCxCType(event);
                break;
            case SEARCH_TYPE.TYPE_CXP:
                this.eventSelectCxPType(event);
                break;
            case SEARCH_TYPE.APPLICATION_CXC:
                this.eventSelectCxCApplication(event);
                break;
            case SEARCH_TYPE.APPLICATION_CXP:
                this.eventSelectCxPApplication(event);
                break;
            case SEARCH_TYPE.VIA_PAGO_X_CONSUMO_DE_VALE:
                this.eventSelectViaPxCVale(event);
                break;
            case SEARCH_TYPE.VIA_COBRO_X_DESCUENTO:
                this.eventSelectViaCxD(event);
                break;
            case SEARCH_TYPE.VIA_PAGO_X_CASTIGO:
                this.eventSelectViaPxCastigo(event);
                break;
            default:
        }
    }

    public onClickBack(): void {
        this.router.navigate(['home']);
    }

    public onClickSearchAndAddBusinessUnit(): void {
        this.genericParamToSearch = new GenericSearchResponseModel();
        this.SEARCH_TYPE_PARAM = SEARCH_TYPE.UNIDAD_NEGOCIO;
        this.titleDialog = this.translateService.instant('shared_dialog_find_business_unit_header');
        this.isVisibleDialogGeneric = true;
    }

    public onSubmitSaveSaiParams(): void {
        if (!this.isSaiParamValid()) return;
        this.confirmationService.confirm({
            message: this.translateService.instant('sai_parameters_confirm_save_business_body'),
            header: this.translateService.instant('sai_parameters_confirm_save_business_header'),
            icon: 'pi pi-info-circle',
            accept: () => this.saveSaiParameters()
        });
    }

    private isSaiParamValid(): boolean {
        let isValid: boolean = true;
        try {
            if (!this.saiParametersModel.usuarioId || !this.saiParametersModel.usuarioIdDesc) {
                this.messageService.showWarning('Información del usuario obligatorio')
                isValid = false;
            }
            if (!this.saiParametersModel.perfilAutorizadorId) {
                this.messageService.showWarning('Perfíl autorizador Obligatorio')
                isValid = false;
            }
            if (!this.saiParametersModel.codigoUsuarioSai || !this.saiParametersModel.codigoUsuarioSaiDesc) {
                this.messageService.showWarning('Información usuario SAI obligatorio');
                isValid = false;
            }
            if (!this.saiParametersModel.codigoUsuarioSai || !this.saiParametersModel.codigoUsuarioSaiDesc) {
                this.messageService.showWarning('Información usuario SAI obligatorio');
                isValid = false;
            }
            if (!this.saiParametersModel.tipoCxP || !this.saiParametersModel.tipoCxPDesc) {
                this.messageService.showWarning('Información tipo cuenta por pagar obligatorio');
                isValid = false;
            }
            if (!this.saiParametersModel.aplicacionCxC || !this.saiParametersModel.aplicacionCxCDesc) {
                this.messageService.showWarning('Información aplicación cuenta por cobrar obligatorio');
                isValid = false;
            }
            if (!this.saiParametersModel.aplicacionCxP || !this.saiParametersModel.aplicacionCxPDesc) {
                this.messageService.showWarning('Información aplicación cuenta por pagar obligatorio');
                isValid = false;
            }
            if (!this.saiParametersModel.viaPagoxConsumo || !this.saiParametersModel.viaPagoxConsumoDesc) {
                this.messageService.showWarning('Información via de pago por consumo obligatorio');
                isValid = false;
            }
            if (!this.saiParametersModel.viaCobroxDescuento || !this.saiParametersModel.viaCobroxDescuentoDesc) {
                this.messageService.showWarning('Información via de cobro por descuento obligatorio');
                isValid = false;
            }
            if (!this.saiParametersModel.viaPagoxCastigo || !this.saiParametersModel.viaPagoxCastigoDesc) {
                this.messageService.showWarning('Información via de pago por castigo obligatorio');
                isValid = false;
            }
            if (this.saiParametersModel.userUnidadNegocioDtoList.length == 0) {
                this.messageService.showWarning('Unidad de negocio obligatorio');
                isValid = false;
            }
            if (this.saiParametersModel.tipoCxCDtoList.length == 0) {
                this.messageService.showWarning('Tipo Cuenta por cobrar(CxC) obligatorio');
                isValid = false;
            }
            return isValid;
        } catch (error) {
            console.error(error);
            this.messageService.showError('DATOS ADICIONALES DE VENDEDOR NO VÁLIDO');
            return false;
        }
    }

    public onClickRemoveBusinessUnits(rowData: UserDatosAdicionalesModel): void {
        this.confirmationService.confirm({
            message: this.translateService.instant('sai_parameters_confirm_remove_business_unit'),
            header: this.translateService.instant('sai_parameters_confirm_remove_business_unit_header'),
            icon: 'pi pi-info-circle',
            accept: () => this.removeBusinessUnit(rowData)
        });
    }

    public onClickRemoveCxCType(rowData: UserDatosAdicionalesModel): void {
        this.confirmationService.confirm({
            message: this.translateService.instant('sai_parameters_confirm_remove_cxc_type'),
            header: this.translateService.instant('sai_parameters_confirm_remove_cxc_type_header'),
            icon: 'pi pi-info-circle',
            accept: () => this.removeTipoCxC(rowData)
        });
    }

    public onClickCleanUserSystem(): void {
        this.saiParametersModel.usuarioId = null;
        this.saiParametersModel.usuarioIdDesc = null;
    }

    // #endregion EVENTS
}
