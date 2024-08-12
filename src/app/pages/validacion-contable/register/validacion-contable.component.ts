import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {MensajeService} from '@app/error/mensaje.service';

import {decryptParam} from '@app/utils/params.security.utils';
import {VentaModel} from 'app/model/venta';
import {VentaService} from '@services/sales/venta.service';
import {ConfirmationService, SelectItem} from 'primeng/api';
import {ValidacionContableService} from '@services/sales/validacion-contable.service';
import {DOCUMENT_TYPE_SALE_BILLING, OPTION_ALL, SEARCH_TYPE, T_DOMAIN_TBZ} from '@app/utils/constants';
import {GenericSearchResponseModel} from '@models/generic-response';
import {DomainModel, DomainModelRequestSingle, DomainModelResponseList} from "@models/domain";
import {RequestHeaderModel} from "@models/requestHeader.model";
import {DomainService} from "@services/template/domain.service";
import {AuthService} from "@services/auth.service";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-validacion-contable',
    templateUrl: './validacion-contable.component.html',
    styleUrls: ['./validacion-contable.component.scss']
})
export class ValidacionContableComponent implements OnInit {

    protected saleModel: VentaModel;

    public isView: boolean;
    public submitted: boolean;
    public cmpReq: string;
    public cmpMin: string;
    public loading: boolean;

    public titleDialog: string;
    public SEARCH_TYPE_PARAM: SEARCH_TYPE;
    public isVisibleDialogGeneric: boolean;
    public genericParamToSearch: GenericSearchResponseModel;
    protected readonly DOCUMENT_TYPE_SALE_BILLING = DOCUMENT_TYPE_SALE_BILLING;
    protected currentTypesOptions: Array<SelectItem> = [{label: OPTION_ALL, value: ''}];

    public ngOnInit(): void {
        this.isView = false;
        this.loading = false;
        this.submitted = false;
        this.saleModel = new VentaModel();
        this.loadCurrentTypesOptions();

        this.titleDialog = '';
        this.SEARCH_TYPE_PARAM = null;
        this.isVisibleDialogGeneric = false;
        this.genericParamToSearch = new GenericSearchResponseModel();

        this.route.params.subscribe((params: Params): void => {
            const {id, isView} = JSON.parse(decryptParam(params.data));
            this.isView = isView;
            this.saleModel.ventaId = id;
            this.loading = true;
            this.loadSale();
        });
    }

    constructor(private route: ActivatedRoute,
                private translateService: TranslateService,
                private router: Router,
                private saleService: VentaService,
                private domainService: DomainService,
                private authService: AuthService,
                private messageService: MensajeService,
                private accountingValidationService: ValidacionContableService,
                private confirmationService: ConfirmationService,
                private datePipe: DatePipe) {
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

    private loadSale(): void {
        this.saleService.onFindByIdExtended(this.saleModel.ventaId).subscribe({
            next: (response: VentaModel): void => {
                this.saleModel = response;
                this.loading = false;
            }
        });
    }

    private validateSale(): void {
        this.saleModel.fechaEmision = this.datePipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss", 'GMT-4', 'es-BO');
        this.saleModel.fechaEntrega = this.datePipe.transform(new Date(), "yyyy-MM-dd", 'GMT-4', 'es-BO');
        debugger;
        this.accountingValidationService.onValidate(this.saleModel).subscribe({
            next: (response: VentaModel) => {
                this.messageService.showSuccess(this.translateService.instant('succes'));
                this.router.navigate(['/sales/register-record']);
            }
        });
    }

    // #endregion ABM_SERVICES

    // #region EVENTS

    public onClickAccountingValidate(): void {
        this.confirmationService.confirm({
            message: this.translateService.instant('accounting_confirm_save'),
            header: this.translateService.instant('accounting_record_title'),
            icon: 'pi pi-info-circle',
            accept: () => this.validateSale()
        });
    }

    public onClickBack(): void {
        this.router.navigate(['/sales/register-record']);
    }

    // #endregion EVENTS


    // #region EVENT_DIALOG_GENERIC_FUNCTIONS

    // public eventCloseDialogGeneric(event: boolean): void {
    //     if (event) {
    //         this.titleDialog = '';
    //         this.genericParamToSearch = new GenericSearchResponseModel();
    //         this.SEARCH_TYPE_PARAM = null;
    //         this.isVisibleDialogGeneric = false;
    //     }
    // }

    // public eventSelectDialogResponse(event: GenericSearchResponseModel): void {
    //     switch (this.SEARCH_TYPE_PARAM) {
    //         case SEARCH_TYPE.TYPE_CXC:
    //             this.eventSelectCxCType(event);
    //             break;
    //         case SEARCH_TYPE.TYPE_CXP:
    //             this.eventSelectCxPType(event);
    //             break;
    //         case SEARCH_TYPE.APPLICATION_CXC:
    //             this.eventSelectCxCApplication(event);
    //             break;
    //         case SEARCH_TYPE.APPLICATION_CXP:
    //             this.eventSelectCxPApplication(event);
    //             break;
    //         case SEARCH_TYPE.VIA_PAGO_X_CONSUMO_DE_VALE:
    //             this.eventSelectViaPxCVale(event);
    //             break;
    //         case SEARCH_TYPE.VIA_COBRO_X_DESCUENTO:
    //             this.eventSelectViaCxD(event);
    //             break;
    //         case SEARCH_TYPE.VIA_PAGO_X_CASTIGO:
    //             this.eventSelectViaPxCastigo(event);
    //             break;
    //         default:
    //     }
    // }

    // #region TIPO_CXC
    // private eventSelectCxCType(event: GenericSearchResponseModel) {
    //     this.saleModel.parametroSaiDto.tipoCxC = event.codigo;
    //     this.saleModel.parametroSaiDto.tipoCxCDesc = event.descripcion;
    // }
    //
    // public onClickOpenDialogFindCxCType(): void {
    //     this.genericParamToSearch.codigo = this.saleModel.parametroSaiDto.tipoCxC;
    //     this.genericParamToSearch.descripcion = this.saleModel.parametroSaiDto.tipoCxCDesc;
    //     this.SEARCH_TYPE_PARAM = SEARCH_TYPE.TYPE_CXC;
    //     this.titleDialog = this.translateService.instant('shared_dialog_find_type_cxc_header');
    //     this.isVisibleDialogGeneric = true;
    // }
    //
    // public onClickCleanCxCType(): void {
    //     this.saleModel.parametroSaiDto.tipoCxC = null;
    //     this.saleModel.parametroSaiDto.tipoCxCDesc = '';
    // }

    // #endregion TIPO_CXC

    // #region TIPO_CXP
    // private eventSelectCxPType(event: GenericSearchResponseModel) {
    //     this.saleModel.parametroSaiDto.tipoCxP = event.codigo;
    //     this.saleModel.parametroSaiDto.tipoCxPDesc = event.descripcion;
    // }
    //
    // public onClickOpenDialogFindCxPType(): void {
    //     this.genericParamToSearch.codigo = this.saleModel.parametroSaiDto.tipoCxP;
    //     this.genericParamToSearch.descripcion = this.saleModel.parametroSaiDto.tipoCxPDesc;
    //     this.SEARCH_TYPE_PARAM = SEARCH_TYPE.TYPE_CXP;
    //     this.titleDialog = this.translateService.instant('shared_dialog_find_type_cxp_header');
    //     this.isVisibleDialogGeneric = true;
    // }
    //
    // public onClickCleanCxPType(): void {
    //     this.saleModel.parametroSaiDto.tipoCxP = null;
    //     this.saleModel.parametroSaiDto.tipoCxPDesc = '';
    // }

    // #endregion TIPO_CXP

    // #region APPLICATION_CxC
    // private eventSelectCxCApplication(event: GenericSearchResponseModel) {
    //     this.saleModel.parametroSaiDto.aplicacionCxC = event.codigo;
    //     this.saleModel.parametroSaiDto.aplicacionCxCDesc = event.descripcion;
    // }
    //
    // public onClickOpenDialogFindCxCApplication(): void {
    //     this.genericParamToSearch.codigo = this.saleModel.parametroSaiDto.aplicacionCxC;
    //     this.genericParamToSearch.descripcion = this.saleModel.parametroSaiDto.aplicacionCxCDesc;
    //     this.SEARCH_TYPE_PARAM = SEARCH_TYPE.APPLICATION_CXC;
    //     this.titleDialog = this.translateService.instant('shared_dialog_find_application_cxc_header');
    //     this.isVisibleDialogGeneric = true;
    // }
    //
    // public onClickCleanCxCApplication(): void {
    //     this.saleModel.parametroSaiDto.aplicacionCxC = null;
    //     this.saleModel.parametroSaiDto.aplicacionCxCDesc = '';
    // }

    // #endregion APPLICATION_CxC

    // #region APPLICATION_CxP
    // private eventSelectCxPApplication(event: GenericSearchResponseModel) {
    //     this.saleModel.parametroSaiDto.aplicacionCxP = event.codigo;
    //     this.saleModel.parametroSaiDto.aplicacionCxPDesc = event.descripcion;
    // }
    //
    // public onClickOpenDialogFindApplicationCxP(): void {
    //     this.genericParamToSearch.codigo = this.saleModel.parametroSaiDto.aplicacionCxP;
    //     this.genericParamToSearch.descripcion = this.saleModel.parametroSaiDto.aplicacionCxPDesc;
    //     this.SEARCH_TYPE_PARAM = SEARCH_TYPE.APPLICATION_CXP;
    //     this.titleDialog = this.translateService.instant('shared_dialog_find_application_cxp_header');
    //     this.isVisibleDialogGeneric = true;
    // }
    //
    // public onClickCleanApplicationCxP(): void {
    //     this.saleModel.parametroSaiDto.aplicacionCxP = null;
    //     this.saleModel.parametroSaiDto.aplicacionCxPDesc = '';
    // }
    // #endregion APPLICATION_CxP

    // #region VIA_PxC_VALE
    // private eventSelectViaPxCVale(event: GenericSearchResponseModel) {
    //     this.saleModel.parametroSaiDto.viaPagoxConsumo = event.codigo;
    //     this.saleModel.parametroSaiDto.viaPagoxConsumoDesc = event.descripcion;
    // }
    //
    // public onClickOpenDialogFindViaPxCDeVale(): void {
    //     this.genericParamToSearch.codigo = this.saleModel.parametroSaiDto.viaPagoxConsumo;
    //     this.genericParamToSearch.descripcion = this.saleModel.parametroSaiDto.viaPagoxConsumoDesc;
    //     this.SEARCH_TYPE_PARAM = SEARCH_TYPE.VIA_PAGO_X_CONSUMO_DE_VALE;
    //     this.titleDialog = this.translateService.instant('shared_dialog_find_via_pxc_vale_header');
    //     this.isVisibleDialogGeneric = true;
    // }
    //
    // public onClickCleanViaPxCDeVale(): void {
    //     this.saleModel.parametroSaiDto.viaPagoxConsumo = null;
    //     this.saleModel.parametroSaiDto.viaPagoxConsumoDesc = '';
    // }
    // #endregion VIA_PxC_VALE

    // #region VIA_CxD
    // private eventSelectViaCxD(event: GenericSearchResponseModel) {
    //     this.saleModel.parametroSaiDto.viaCobroxDescuento = event.codigo;
    //     this.saleModel.parametroSaiDto.viaCobroxDescuentoDesc = event.descripcion;
    // }
    //
    // public onClickOpenDialogFindViaCxD(): void {
    //     this.genericParamToSearch.codigo = this.saleModel.parametroSaiDto.viaCobroxDescuento;
    //     this.genericParamToSearch.descripcion = this.saleModel.parametroSaiDto.viaCobroxDescuentoDesc;
    //     this.SEARCH_TYPE_PARAM = SEARCH_TYPE.VIA_COBRO_X_DESCUENTO;
    //     this.titleDialog = this.translateService.instant('shared_dialog_find_via_cxd_header');
    //     this.isVisibleDialogGeneric = true;
    // }
    //
    // public onClickCleanViaCxD(): void {
    //     this.saleModel.parametroSaiDto.viaCobroxDescuento = null;
    //     this.saleModel.parametroSaiDto.viaCobroxDescuentoDesc = '';
    // }
    // #endregion VIA_CxD

    // #region VIA_PAGO_X_CASTIGO
    // private eventSelectViaPxCastigo(event: GenericSearchResponseModel) {
    //     this.saleModel.parametroSaiDto.viaPagoxCastigo = event.codigo;
    //     this.saleModel.parametroSaiDto.viaPagoxCastigoDesc = event.descripcion;
    // }
    //
    // public onClickOpenDialogFindViaPxCastigo(): void {
    //     this.genericParamToSearch.codigo = this.saleModel.parametroSaiDto.viaPagoxCastigo;
    //     this.genericParamToSearch.descripcion = this.saleModel.parametroSaiDto.viaPagoxCastigoDesc;
    //     this.SEARCH_TYPE_PARAM = SEARCH_TYPE.VIA_PAGO_X_CASTIGO;
    //     this.titleDialog = this.translateService.instant('shared_dialog_find_via_pxcastigo_header');
    //     this.isVisibleDialogGeneric = true;
    // }
    //
    // public onClickCleanViaPxCastigo(): void {
    //     this.saleModel.parametroSaiDto.viaPagoxCastigo = null;
    //     this.saleModel.parametroSaiDto.viaPagoxCastigoDesc = '';
    // }
    // #endregion VIA_PAGO_X_CASTIGO

    // #endregion EVENT_DIALOG_GENERIC_FUNCTIONS
}
