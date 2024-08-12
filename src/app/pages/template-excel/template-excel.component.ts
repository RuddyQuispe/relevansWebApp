import * as $ from 'jquery';
import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FileUpload} from 'primeng/fileupload';
import {ConfirmationService, SelectItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

import {CONFIG} from '@config/config';
import {
    DIRECTION_ORDER_BY,
    OPTION_ALL,
    SEARCH_TYPE, STATUS_SALE,
    T_DOMAIN_TBZ
} from '@app/utils/constants';
import {DomainModel, DomainModelRequestSingle, DomainModelResponseList} from '@models/domain';
import {RequestHeaderModel} from '@models/requestHeader.model';
import {encryptParam} from '@app/utils/params.security.utils';

import {VentaService} from '@services/sales/venta.service';
import {DomainService} from '@services/template/domain.service';
import {AuthService} from '@services/auth.service';
import {MensajeService} from '@app/error/mensaje.service';

import {VentaFiltroModel, VentaModel} from 'app/model/venta';
import {ResponseFilterModel} from '@models/response.filter.model';
import {ArchivoModel} from '@models/archivo.model';
import {GenericSearchResponseModel} from '@models/generic-response';

@Component({
    selector: 'app-template-excel',
    templateUrl: './template-excel.component.html',
    styleUrls: ['./template-excel.component.scss']
})
export class TemplateExcelComponent implements AfterViewInit {

    @ViewChild('fileInput') fileInput: FileUpload;

    public filterSale: VentaFiltroModel;
    public salesResponse: ResponseFilterModel<VentaModel>;
    public fileModel: ArchivoModel;


    public rowsTables: number = Number(CONFIG.ROWS_TABLE);
    public sizeOrders: number;
    public loading: boolean;
    public currentTypesOptions: Array<SelectItem> = [{label: OPTION_ALL, value: ''}];
    public displayDialogUploadTemplate: boolean;
    public submittedUploadTemplate: boolean;
    private saleModelToUploadTemplate: VentaModel;
    protected isViewFilterSearchUser: boolean;
    protected readonly SEARCH_TYPE = SEARCH_TYPE;
    protected readonly STATUS_SALE = STATUS_SALE;

    constructor(private router: Router,
                private domainService: DomainService,
                private saleService: VentaService,
                private authService: AuthService,
                private changeDetector: ChangeDetectorRef,
                private messageService: MensajeService,
                private translateService: TranslateService) {
        this.initializeFilter();
        this.loadCurrentTypesOptions();
        this.displayDialogUploadTemplate = false;
        this.submittedUploadTemplate = false;
        this.isViewFilterSearchUser = false;
        this.sizeOrders = 0;
        this.salesResponse = new ResponseFilterModel<VentaModel>();
        this.loading = false;
    }

    public ngAfterViewInit(): void {
        this.changeDetector.detectChanges();
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
        this.saleService.onList(VentaFiltroModel.clone(this.filterSale)).subscribe({
            next: (response: ResponseFilterModel<VentaModel>) => {
                this.salesResponse = response;
                this.sizeOrders = response.totalElementos;
                this.loading = false;
            },
            error: err => this.loading = false
        });
    }

    private getTemplateFileToDownload(ventaId: number) {
        this.saleService.onDownloadTemplate(ventaId).subscribe({
            next: (response: ArchivoModel) => {
                // no se encontró la plantilla
                if (!response.base64 && !response.nombreArchivo) {
                    this.messageService.showError('No se encontró la plantilla de beneficiarios correspondiente a esta venta.');
                    this.fileModel = null;
                    this.fileInput.clear();
                    return;
                }
                this.fileModel = response;
                this.fileInput.clear();
                if (!response.base64 && !response.nombreArchivo) {
                    this.fileModel = null;
                    return;
                }
                // load file xlxs por default
                const blob = new Blob(['contenido'], {type: 'text/xlsx'});
                // Crear un objeto File a partir del Blob
                this.fileInput.files.push(new File([blob], this.fileModel.nombreArchivo, {type: 'text/xlsx'}));
            },
            error: err => {
                this.fileModel = null;
                this.fileInput.clear();
            }
        });
    }

    // #endregion ABM_SERVICES

    // #region EVENTS
    public onClickUploadTemplate(event: MouseEvent, ventaModel?: VentaModel): void {
        this.saleModelToUploadTemplate = ventaModel;
        this.getTemplateFileToDownload(ventaModel.ventaId);
        this.displayDialogUploadTemplate = true;
    }

    public onClickShowDialogToView(event: MouseEvent, rowData: any): void {
        this.router.navigate(['/sales/sale/', encryptParam(JSON.stringify({
            id: rowData.ventaId || 0,
            isView: true,
            from: 'B'
        }))]);
        event.preventDefault();
    }

    public onSubmitFilterList = (): void => this.loadSales();

    public onChangePageTable(event: any) {
        this.filterSale.page = (event.first / this.rowsTables);
        this.filterSale.direction = !event.sortField ? DIRECTION_ORDER_BY.DESC : (event.sortOrder > 0 ? DIRECTION_ORDER_BY.ASC : DIRECTION_ORDER_BY.DESC);
        this.filterSale.orderBy = event.sortField || VentaModel.PROPERTY_VENTA_ID;
        console.log('CHANGE PAGE:', this.filterSale);
        this.loadSales();
    }

    public onClickClearFilter(): void {
        this.initializeFilter();
    }

    public onSubmitUploadTemplate(): void {
        if (!this.fileInput.files || this.fileInput.files.length == 0) {
            this.messageService.showWarning('No se cargó ningún archivo');
            return;
        }
        this.saleService.onUpload(this.fileInput.files[0], this.saleModelToUploadTemplate.ventaId).subscribe({
            next: (response: any) => {
                this.messageService.showSuccess(this.translateService.instant('template_excel_success_message'));
                this.onClickCloseDialogUploadTemplate();
            },
            error: err => this.onClickCloseDialogUploadTemplate()
        });
    }

    public onClickDownloadTemplateLoaded = (): void =>
        this.downloadTemplateFile()

    public onClickCloseDialogUploadTemplate(): void {
        this.displayDialogUploadTemplate = false;
        this.submittedUploadTemplate = false;
        this.saleModelToUploadTemplate = null;
        this.fileModel = null;
        this.fileInput.clear();
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

    // #region EXTERNAL_FUNCTION
    private downloadTemplateFile() {
        if (!this.fileModel.base64.includes('data:'))
            this.fileModel.base64 = 'data:application/xlsx;base64,' + this.fileModel.base64;
        const url: string = this.fileModel.base64.replace(/^data:application\/[^;]+/, 'data:application/octet-stream');
        const download: HTMLElement = document.getElementById('iddownloaddocs');
        $(download).attr('download', this.fileModel.nombreArchivo);
        $(download).attr('href', url);
        download.click();
        this.messageService.showSuccess(this.translateService.instant('template_excel_show_message'));
    }

    protected eventCloseDialogFindUsers(event: boolean): void {
        if (event)
            this.isViewFilterSearchUser = false;
    }

    protected eventSelectUser(event: GenericSearchResponseModel): void {
        this.filterSale.usuarioVenta = event.codigo;
        this.filterSale.nombreUsuario = event.descripcion;
    }

    private initializeFilter(): void {
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
                STATUS_SALE.VALIDADA],
            null,
            null);
        this.filterSale.fechaInicioDate = new Date();
        this.filterSale.fechaFinDate = new Date();
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

    // #endregion EXTERNAL_FUNCTIONS
}
