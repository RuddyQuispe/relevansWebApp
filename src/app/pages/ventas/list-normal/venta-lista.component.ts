import * as $ from 'jquery';
import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {VentaFiltroModel, VentaModel} from 'app/model/venta';
import {Router} from '@angular/router';
import {CONFIG} from '@config/config';
import {encryptParam} from '@app/utils/params.security.utils';
import {VentaService} from '@services/sales/venta.service';
import {ResponseFilterModel} from '@models/response.filter.model';
import {DIRECTION_ORDER_BY, OPTION_ALL, SEARCH_TYPE, STATUS_SALE, T_DOMAIN_TBZ} from '@app/utils/constants';
import {MensajeService} from '@app/error/mensaje.service';
import {TranslateService} from '@ngx-translate/core';
import {ArchivoModel} from '@models/archivo.model';
import {GenericSearchResponseModel} from '@models/generic-response';
import {AuthService} from "@services/auth.service";
import {ConfirmationService, SelectItem} from "primeng/api";
import {DomainModel, DomainModelRequestSingle, DomainModelResponseList} from "@models/domain";
import {DomainService} from "@services/template/domain.service";
import {RequestHeaderModel} from "@models/requestHeader.model";

@Component({
    selector: 'app-venta-lista',
    templateUrl: './venta-lista.component.html',
    styleUrls: ['./venta-lista.component.scss']
})
export class VentaListaComponent implements AfterViewInit {

    public filterSale: VentaFiltroModel;
    public salesResponse: ResponseFilterModel<VentaModel>;
    protected currentTypesOptions: Array<SelectItem> = [{label: OPTION_ALL, value: ''}];

    public rowsTables: number = Number(CONFIG.ROWS_TABLE);
    public sizeOrders: number;
    public loading: boolean;
    public excelFileName: string;
    protected isViewFilterSearchUser: boolean;
    protected readonly SEARCH_TYPE = SEARCH_TYPE;
    protected readonly STATUS_SALE = STATUS_SALE;


    constructor(private router: Router,
                private saleService: VentaService,
                private changeDetector: ChangeDetectorRef,
                private authService: AuthService,
                private domainService: DomainService,
                private messageService: MensajeService,
                private translateService: TranslateService,
                private confirmationService: ConfirmationService) {
        this.initializeFilterSale();
        this.loadCurrentTypesOptions();
        this.loading = false;
        this.sizeOrders = 0;
        this.isViewFilterSearchUser = false;
        this.salesResponse = new ResponseFilterModel<VentaModel>();
    }

    protected get canAccessAllSales(): boolean {
        const {userId, menu} = this.authService.currentUserValue;
        if (userId === 0)
            return true;
        if (menu.some(m => m.label.trim() == 'Ventas' &&
            m.items.some(i => i.label.trim() == 'Autorizar' || i.label.trim() == 'Validación contable')))
            return true;
        return false;
    }

    public ngAfterViewInit(): void {
        this.changeDetector.detectChanges();
    }

    // #region ABM SERVICES
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
        if (!this.canAccessAllSales)
            this.filterSale.usuarioVenta = this.authService.getUserId();
        this.loading = true;
        this.filterSale.fechaFin = this.filterSale.fechaFinDate.toISOString().slice(0, 10);
        this.filterSale.fechaInicio = this.filterSale.fechaInicioDate.toISOString().slice(0, 10);
        this.saleService.onList(VentaFiltroModel.clone(this.filterSale)).subscribe({
            next: (response: ResponseFilterModel<VentaModel>) => {
                this.salesResponse = response;
                this.sizeOrders = response.totalElementos;
                this.loading = false;
            },
            error: err => this.loading = false
        });
    }

    // #endregion ABM SERVICES

    // #region EVENTS
    public onClickShowDialogToEdit(event: MouseEvent, rowData?: VentaModel): void {
        if (rowData.estado !== STATUS_SALE.CREADA) {
            this.messageService.showWarning(`La venta ${rowData.ventaId} no puede ser editada ya que esta ${rowData.estado}. Solo puede editar una venta en estado CREADA`);
            return;
        }
        this.router.navigate(['/sales/sale/', encryptParam(JSON.stringify({
            id: rowData.ventaId || 0,
            isView: false
        }))]);
        event.preventDefault();
    }

    public onClickShowDialogToView(event: MouseEvent, rowData: any): void {
        this.router.navigate(['/sales/sale/', encryptParam(JSON.stringify({
            id: rowData.ventaId || 0,
            isView: true,
            from: 'V'
        }))]);
    }

    public onClickAddSaleNormal = (): void => {
        this.router.navigate(['/sales/sale', encryptParam(JSON.stringify({
            id: 0,
            isView: false,
            from: 'V'
        }))]);
    }

    // public onClickAddSaleDirect = (): void => {
    //     this.router.navigate(['/sales/sale/direct', encryptParam(JSON.stringify({
    //         id: 0,
    //         isView: false
    //     }))]);
    // }

    public onSubmitFilterList(): void {
        this.filterSale.page = 0;
        this.loadSales()
    }

    public onChangePageTable(event: any) {
        this.filterSale.page = (event.first / this.rowsTables);
        this.filterSale.direction = !event.sortField ? DIRECTION_ORDER_BY.DESC : (event.sortOrder > 0 ? DIRECTION_ORDER_BY.ASC : DIRECTION_ORDER_BY.DESC);
        this.filterSale.orderBy = event.sortField || VentaModel.PROPERTY_VENTA_ID;
        console.log('CHANGE PAGE:', this.filterSale);
        this.loadSales();
    }

    public onClickClearFilter(): void {
        this.initializeFilterSale();
    }

    public onClickDownloadTemplate(): void {
        this.saleService.onDownloadTemplate(0).subscribe({
            next: (response: ArchivoModel) => {
                if (!response.base64 && !response.nombreArchivo) {
                    this.messageService.showError('No se encontró la plantilla de beneficiarios');
                    return;
                }
                if (!response.base64.includes('data:'))
                    response.base64 = 'data:application/xlsx;base64,' + response.base64;
                this.excelFileName = response.nombreArchivo;
                const url: string = response.base64.replace(/^data:application\/[^;]+/, 'data:application/octet-stream');
                const download: HTMLElement = document.getElementById('iddownloaddocs');
                $(download).attr('download', this.excelFileName);
                $(download).attr('href', url);
                download.click();
                this.messageService.showSuccess(this.translateService.instant('template_excel_show_message'));
            },
            error: err => this.messageService.showError('No se encontró la plantilla de beneficiarios')
        });
    }

    protected onClickShowModalSearchUser(): void {
        this.isViewFilterSearchUser = true;
    }

    protected onChangeInputUserName(): void {
        this.filterSale.usuarioVenta = null;
        this.messageService.showInfo(this.translateService.instant('sale_filter_user_warning'));
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
            [STATUS_SALE.AUTORIZADA,
                STATUS_SALE.CREADA,
                STATUS_SALE.IMPRESO,
                STATUS_SALE.RECHAZADA,
                STATUS_SALE.VALIDADA,
                STATUS_SALE.REVERTIDA],
            null,
            null,
            this.canAccessAllSales ? null : this.authService.getUserId(),
            null);
        this.filterSale.fechaInicioDate = new Date();
        this.filterSale.fechaFinDate = new Date();
    }

    // #endregion EXTERNAL_FUNCTIONS
    protected onClickSaleRevert(event: MouseEvent, saleModel: VentaModel): void {
        event.preventDefault();
        if (saleModel.estado == STATUS_SALE.REVERTIDA.toString()) {
            this.messageService.showError('Esta venta ya fué revertida');
            return;
        }
        this.confirmationService.confirm({
            header: this.translateService.instant('sale_list_btn_revert'),
            message: this.translateService.instant('sale_list_btn_revert_message'),
            accept: () => this.reverseSale(saleModel)
        });
    }

    private reverseSale(saleModel: VentaModel): void {
        this.saleService.onReverseSale(saleModel.ventaId).subscribe({
            next: (response: VentaModel) => {
                if (response.estado == STATUS_SALE.REVERTIDA) {
                    this.messageService.showSuccess('venta revertida correctamente');
                    this.loadSales();
                }
            }
        });
    }
}
