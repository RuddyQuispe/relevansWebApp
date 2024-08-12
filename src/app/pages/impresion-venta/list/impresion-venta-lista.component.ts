import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {VentaFiltroModel, VentaModel} from 'app/model/venta';
import {CONFIG} from '@config/config';
import {TranslateService} from '@ngx-translate/core';
import {encryptParam} from '@app/utils/params.security.utils';
import {DIRECTION_ORDER_BY, OPTION_ALL, SEARCH_TYPE, STATUS_SALE, T_DOMAIN_TBZ} from '@app/utils/constants';
import {Router} from '@angular/router';


import {ImpresionValesService} from '@services/sales/impresion-vales.service';
import {ResponseFilterModel} from '@models/response.filter.model';
import {GenericSearchResponseModel} from '@models/generic-response';
import {MensajeService} from "@app/error/mensaje.service";
import {DomainService} from "@services/template/domain.service";
import {DomainModel, DomainModelRequestSingle, DomainModelResponseList} from "@models/domain";
import {RequestHeaderModel} from "@models/requestHeader.model";
import {AuthService} from "@services/auth.service";
import {SelectItem} from "primeng/api";

@Component({
    selector: 'app-ventas-printer',
    templateUrl: './impresion-venta-lista.component.html',
    styleUrls: ['./impresion-venta-lista.component.scss']
})
export class ImpresionVentaListaComponent implements AfterViewInit {
    public filterSale: VentaFiltroModel;
    public saleResponse: ResponseFilterModel<VentaModel>;
    public sale: VentaModel;

    public rowsTables: number = Number(CONFIG.ROWS_TABLE);
    public loading: boolean;
    public cmpMin: string;
    public cmpReq: string;
    public sizeOrders: number;
    protected isViewFilterSearchUser: boolean;
    protected readonly SEARCH_TYPE = SEARCH_TYPE;
    protected readonly STATUS_SALE = STATUS_SALE;
    protected currentTypesOptions: Array<SelectItem> = [{label: OPTION_ALL, value: ''}];

    constructor(private translateService: TranslateService,
                private router: Router,
                private authService: AuthService,
                private messageService: MensajeService,
                private domainService: DomainService,
                private printerSaleService: ImpresionValesService,
                private changeDetectorRef: ChangeDetectorRef) {
        this.initializeFilterSale();
        this.loadCurrentTypesOptions();
        this.loading = false;
        this.isViewFilterSearchUser = false;
        this.saleResponse = new ResponseFilterModel<VentaModel>();
        this.sizeOrders = 0;
        this.cmpReq = this.translateService.instant('cmpReq');
        this.cmpMin = this.translateService.instant('cmpMin');
    }

    ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges();
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
        this.filterSale.fechaInicio = this.filterSale.fechaInicioDate.toISOString().slice(0, 10);
        this.filterSale.fechaFin = this.filterSale.fechaFinDate.toISOString().slice(0, 10);
        this.printerSaleService.onList(VentaFiltroModel.clone(this.filterSale)).subscribe({
            next: (response: ResponseFilterModel<VentaModel>) => {
                this.saleResponse = response;
                this.sizeOrders = this.saleResponse.totalElementos;
                this.loading = false;
            },
            error: err => this.loading = false
        });
    }

    // #endregion ABM_SERVICES

    // #region EVENTS

    public onClickShowDialogToEdit(event: Event, entity: VentaModel): void {
        this.router.navigate(['/sales/sales-print', encryptParam(JSON.stringify({
            id: entity.ventaId,
            isView: false
        }))]);
    }

    public onClickShowDialogToView(event: Event, entity: VentaModel): void {
        this.router.navigate(['/sales/sales-print', encryptParam(JSON.stringify({
            id: entity.ventaId,
            isView: true
        }))]);
    }

    public onSubmitFilterList(): void {
        this.filterSale.page = 0;
        this.loadSales();
    }

    public onChangePageTable(event: any): void {
        this.filterSale.page = (event.first / this.rowsTables);
        this.filterSale.direction = !event.sortField ? DIRECTION_ORDER_BY.DESC : (event.sortOrder > 0 ? DIRECTION_ORDER_BY.ASC : DIRECTION_ORDER_BY.DESC);
        this.filterSale.orderBy = event.sortField || VentaModel.PROPERTY_VENTA_ID;
        console.log('CHANGE PAGE:', this.filterSale);
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
            [STATUS_SALE.VALIDADA],
            null,
            null
        );
        this.filterSale.fechaInicioDate = new Date();
        this.filterSale.fechaFinDate = new Date();
    }

    // #endregion EXTERNAL_FUNCTIONS
}
