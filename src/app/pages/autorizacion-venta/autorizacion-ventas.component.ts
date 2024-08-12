import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';


import {CONFIG} from '@config/config';
import {VentaFiltroModel, VentaModel} from 'app/model/venta';
import {AutorizacionService} from '@services/sales/autorizacion.service';
import {MensajeService} from '@app/error/mensaje.service';
import {TranslateService} from '@ngx-translate/core';
import {AutorizacionRequestModel} from '@models/autorizacion';
import {
    DIRECTION_ORDER_BY,
    STATUS_SALE_AUTHORIZATION,
    SEARCH_TYPE,
    STATUS_SALE,
    T_DOMAIN_TBZ, OPTION_ALL
} from '@app/utils/constants';
import {ResponseFilterModel} from '@models/response.filter.model';
import {ConfirmationService, SelectItem} from 'primeng/api';
import {GenericSearchResponseModel} from '@models/generic-response';
import {AuthService} from "@services/auth.service";
import {DomainModel, DomainModelRequestSingle, DomainModelResponseList} from "@models/domain";
import {RequestHeaderModel} from "@models/requestHeader.model";
import {DomainService} from "@services/template/domain.service";

@Component({
    selector: 'app-autorizacion-venta',
    templateUrl: './autorizacion-ventas.component.html',
    styleUrls: ['./autorizacion-ventas.component.scss']
})
export class AutorizacionVentasComponent implements AfterViewInit {

    public filterSale: VentaFiltroModel;
    public saleResponse: ResponseFilterModel<VentaModel>;

    public salesSelectedToApprove: Array<VentaModel>;
    protected currentTypesOptions: Array<SelectItem> = [{label: OPTION_ALL, value: ''}];
    public rowsTables: number = Number(CONFIG.ROWS_TABLE);
    public loading: boolean;
    public sizeOrders: number;
    protected isViewFilterSearchUser: boolean;
    protected readonly SEARCH_TYPE = SEARCH_TYPE;

    constructor(private autorizacionService: AutorizacionService,
                private authService: AuthService,
                private domainService: DomainService,
                private messageService: MensajeService,
                private translateService: TranslateService,
                private confirmationService: ConfirmationService,
                private changeDetectorRefService: ChangeDetectorRef) {
        this.initializeFilterSale();
        this.loadCurrentTypesOptions();
        this.saleResponse = new ResponseFilterModel<VentaModel>();
        this.salesSelectedToApprove = [];
        this.loading = false;
        this.isViewFilterSearchUser = false;
        this.sizeOrders = 0;
    }

    public ngAfterViewInit(): void {
        this.changeDetectorRefService.detectChanges();
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
                this.loadSales();
            }
        });
    }

    private loadSales(): void {
        this.loading = true;
        this.filterSale.usuarioVenta = this.authService.getUserId();
        this.filterSale.fechaInicio = this.filterSale.fechaInicioDate.toISOString().slice(0, 10);
        this.filterSale.fechaFin = this.filterSale.fechaFinDate.toISOString().slice(0, 10);
        this.autorizacionService.onList(VentaFiltroModel.clone(this.filterSale)).subscribe({
            next: (response: ResponseFilterModel<VentaModel>) => {
                this.saleResponse = response;
                this.sizeOrders = response.totalElementos;
                this.loading = false;
            },
            error: err => this.loading = false
        });
    }

    private changeStateOfSale(sale: VentaModel, statusSale: boolean): void {
        this.loading = true;
        this.autorizacionService.autorizar(new AutorizacionRequestModel(
            sale.ventaId, statusSale)).subscribe({
            next: (response: VentaModel) => {
                this.messageService.showSuccess(this.translateService.instant('succes'));
                this.loadSales();
                this.loading = false;
            },
            error: err => this.loading = false
        });
    }

    private changeStateMassiveOfSale(): void {
        this.loading = true;
        const saleIdToApprove: Array<number> = this.salesSelectedToApprove.map(s => s.ventaId);
        this.autorizacionService.autorizarAll(saleIdToApprove).subscribe({
            next: (response: Array<string>) => {
                if (response.length === 0) {
                    this.messageService.showSuccess(this.translateService.instant('succes'));
                } else {
                    response.forEach(message => this.messageService.showError(message));
                }
                this.loadSales();
            },
            error: err => this.loading = false
        });
    }

    // #endregion ABM_SERVICES

    // #region EVENTS
    public onClickRejectSale(sale: VentaModel): void {
        this.confirmationService.confirm({
            message: this.translateService.instant('authorize_dialog_reject'),
            header: this.translateService.instant('authorize_btn_reject'),
            icon: 'pi pi-times-circle',
            accept: () => this.changeStateOfSale(sale, STATUS_SALE_AUTHORIZATION.RECHAZADO)
        });
    }

    public onClickApproveSale(sale: VentaModel): void {
        this.confirmationService.confirm({
            message: this.translateService.instant('authorize_dialog_confirm'),
            header: this.translateService.instant('authorize_btn_approve'),
            icon: 'pi pi-check-circle',
            accept: () => this.changeStateOfSale(sale, STATUS_SALE_AUTHORIZATION.APROBADO)
        });
    }

    public onClickApproveAllSales(): void {
        this.confirmationService.confirm({
            message: this.translateService.instant('authorize_dialog_confirm_all'),
            header: this.translateService.instant('authorize_btn_approve'),
            icon: 'pi pi-check-circle',
            accept: () => this.changeStateMassiveOfSale()
        });
    }

    public onSubmitFilterSales(): void {
        this.filterSale.page = 0;
        this.loadSales();
    }

    public onChangePageTable(event: any): void {
        this.filterSale.page = (event.first / this.rowsTables);
        this.filterSale.direction = !event.sortField ? DIRECTION_ORDER_BY.DESC : (event.sortOrder > 0 ? DIRECTION_ORDER_BY.ASC : DIRECTION_ORDER_BY.DESC);
        this.filterSale.orderBy = event.sortField || VentaModel.PROPERTY_VENTA_ID;
        console.log('CHANGE PAGE:', this.filterSale);
        this.filterSale.usuarioVenta = this.authService.getUserId();
        this.loadSales();
    }

    public onClickClearFilter(): void {
        this.initializeFilterSale();
    }

    protected onChangeInputUserName(): void {
        this.filterSale.usuarioVenta = null;
        this.messageService.showInfo(this.translateService.instant('sale_filter_user_warning'));
    }

    protected onClickShowModalSearchUser(): void {
        this.isViewFilterSearchUser = true;
    }

    protected onSelectInitDateFilter(): void {
        if (this.filterSale.fechaInicioDate > this.filterSale.fechaFinDate) {
            this.messageService.showWarning('fecha inicio no valida');
            return;
        }
        this.filterSale.fechaInicio = this.filterSale.fechaInicioDate.toISOString().slice(0, 10);
        this.filterSale.page = 0;
        this.loadSales();
    }

    protected onSelectEndDateFilter(): void {
        if (this.filterSale.fechaFinDate < this.filterSale.fechaInicioDate) {
            this.messageService.showWarning('fecha fin no valida');
            return;
        }
        this.filterSale.fechaFin = this.filterSale.fechaFinDate.toISOString().slice(0, 10);
        this.filterSale.page = 0;
        this.loadSales();
    }

    // #endregion EVENTS
    // #region EXTERNAL_FUNCTIONS

    protected eventCloseDialogFindUsers(event: boolean): void {
        if (event)
            this.isViewFilterSearchUser = false;
    }

    protected eventSelectUser(event: GenericSearchResponseModel): void {
        this.filterSale.usuarioVenta = event.codigo;
        this.filterSale.nombreUsuario = event.descripcion;
    }

    private initializeFilterSale(): void {
        this.filterSale = new VentaFiltroModel(
            VentaModel.PROPERTY_VENTA_ID,
            DIRECTION_ORDER_BY.DESC,
            0,
            this.rowsTables,
            new Date().toString(),
            new Date().toString(),
            null,
            null,
            [STATUS_SALE.CREADA],
            null,
            null,
            this.authService.getUserId(),
            null);
        this.filterSale.fechaInicioDate = new Date(this.filterSale.fechaInicio);
        this.filterSale.fechaFinDate = new Date(this.filterSale.fechaFin);
    }

    // #endregion EXTERNAL_FUNCTIONS
}
