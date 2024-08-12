import * as $ from 'jquery';
import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {VentaModel} from '@models/venta';
import {CorteValeModel} from '@models/corte-vale';
import {ConfirmationService, SelectItem} from 'primeng/api';
import {CONFIG} from '@config/config';
import {
    ACCOUNTING_RECORD_SALE,
    DOCUMENT_TYPE_SALE_BILLING,
    SEARCH_TYPE,
    T_DOMAIN_NAME,
    T_DOMAIN_TBZ
} from '@app/utils/constants';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {MensajeService} from '@app/error/mensaje.service';
import {VentaService} from '@services/sales/venta.service';
import {DomainService} from '@services/template/domain.service';
import {AuthService} from '@services/auth.service';
import {decryptParam} from '@app/utils/params.security.utils';
import {parseDateStringToDate} from '@app/utils/helpers';
import {DomainModel, DomainModelRequestSingle, DomainModelResponseList} from '@models/domain';
import {RequestHeaderModel} from '@models/requestHeader.model';
import {ArchivoModel} from '@models/archivo.model';
import {ParametrosSaiService} from '@services/admin/parametros-sai.service';
import {UserDatosAdicionalesByTypeModelRequest, UserParametrosSaiModel} from '@models/parametros-sai';
import {forkJoin} from "rxjs";
import {RegistroContableVentaModel} from "@models/registro-contable";
import {RegistroContableService} from "@services/admin/registro-contable.service";

@Component({
    selector: 'app-venta-directa',
    templateUrl: './venta.directa.component.html',
    styleUrls: ['./venta.directa.component.scss']
})
export class VentaDirectaComponent implements AfterViewInit, OnInit {

    protected saleModel: VentaModel;
    protected newVoucherCut: CorteValeModel;

    protected loading: boolean;
    protected isView: boolean;
    protected cmpReq: string;
    protected cmpMin: string;
    protected businessUnitOptions: SelectItem[] = [];
    protected cxcTypeOptions: SelectItem[] = [];
    protected typeCurrent: SelectItem[] = [];
    protected rowsTables: number = Number(CONFIG.ROWS_TABLE);
    protected readonly SEARCH_TYPE = SEARCH_TYPE;
    protected isVisibleDialogOfAddVoucher = false;
    protected submittedVoucherAdd: boolean;
    protected submitted: boolean;
    protected receiptSaleFileName: string;
    protected canAddOrUpdateSale: boolean;
    protected readonly DOCUMENT_TYPE_SALE_BILLING = DOCUMENT_TYPE_SALE_BILLING;
    protected readonly ACCOUNTING_RECORD_SALE = ACCOUNTING_RECORD_SALE;
    protected accountingRecordSale?: RegistroContableVentaModel;

    constructor(private route: ActivatedRoute,
                private translateService: TranslateService,
                private router: Router,
                private messageService: MensajeService,
                private confirmationService: ConfirmationService,
                private changeDetector: ChangeDetectorRef,
                private saleService: VentaService,
                private accountingRecordService: RegistroContableService,
                private saiParameterUserService: ParametrosSaiService,
                private domainService: DomainService,
                private authService: AuthService) {
    }

    public ngOnInit(): void {
        // initialize options values from translateService
        this.cmpReq = this.translateService.instant('cmpReq');
        this.cmpMin = this.translateService.instant('cmpMin');
        this.loading = false;
        this.canAddOrUpdateSale = true;
        this.submitted = false;
        this.loadUserDatosAdicionalesOptions(this.authService.getUserId());
        this.loadTypeCoin();
        // get params to edit, readonly or venta-normal
        this.route.params.subscribe((params: Params): void => {
            const {id, isView} = JSON.parse(decryptParam(params.data));
            this.isView = isView;
            this.newVoucherCut = new CorteValeModel();
            this.saleModel = new VentaModel();
            this.saleModel.ventaId = id;
            this.loadConfigDaysOfValidityOfVouchers(this.saleModel);
            if (id === 0) {
                this.loadSaiParametersUser();
            }
        });
        if (!this.saleModel.ventaId || this.saleModel.ventaId === 0) return;
        this.findSale(this.saleModel.ventaId);
    }

    public ngAfterViewInit(): void {
        this.changeDetector.detectChanges();
    }

    // #region SERVICES_ABM
    private loadUserDatosAdicionalesOptions(userId: number): void {
        forkJoin([
            this.saiParameterUserService.onListTypeAccountByUser(new UserDatosAdicionalesByTypeModelRequest(userId, T_DOMAIN_NAME.UNIDAD_NEGOCIO)),
            this.saiParameterUserService.onListTypeAccountByUser(new UserDatosAdicionalesByTypeModelRequest(userId, T_DOMAIN_NAME.TIPO_CXC))
        ]).subscribe({
            next: ([businessUnitsOptions, cxcTypeOptions]): void => {
                this.businessUnitOptions = [{label: this.translateService.instant('selectList'), value: null}];
                this.businessUnitOptions.push(...businessUnitsOptions.map(u => {
                    return {label: u.descripcion, value: u.codigoSai};
                }));
                this.cxcTypeOptions = [{label: this.translateService.instant('selectList'), value: null}];
                this.cxcTypeOptions.push(...cxcTypeOptions.map(u => {
                    return {label: u.descripcion, value: u.codigoSai};
                }));
            }
        });
    }

    private loadSaiParametersUser() {
        this.saiParameterUserService.onFindByAgenda(this.authService.getUserId())
            .subscribe({
                next: (response: UserParametrosSaiModel) => {
                    if (!response.codigoUsuarioSai || !response.codigoUsuarioSaiDesc) {
                        this.messageService.showError('El usuario ' + this.authService.getUser() + ' no puede realizar ventas sin tener configurador los parametros SAI')
                        this.canAddOrUpdateSale = false;
                        return;
                    }
                    this.saleModel.clienteCodigo = response.codigoUsuarioSai;
                    this.saleModel.clienteNombre = response.codigoUsuarioSaiDesc;
                }
            });
    }

    private findSale(id: number): void {
        this.saleService.onFindById(id).subscribe({
            next: (response: VentaModel) => {
                this.saleModel = response;
                this.saleModel.moneda = response.moneda.toString();
                this.saleModel.fechaEmisionDate = parseDateStringToDate(this.saleModel.fechaEmision);
                this.saleModel.fechaEntregaDate = parseDateStringToDate(this.saleModel.fechaEntrega);
                this.findAccountingRecord();
                this.saleModel.parametroSaiDto.unidadNegocio = response.parametroSaiDto.unidadNegocio.toString();
                this.saleModel.parametroSaiDto.tipoCxC = response.parametroSaiDto.tipoCxC.toString();
                this.loadUserDatosAdicionalesOptions(this.saleModel.usuarioVenta);
            }
        });
    }

    private saveOrMergeSale(): void {
        let ventaModel: VentaModel = VentaModel.clone(this.saleModel);
        ventaModel.fechaEntrega = this.saleModel.fechaEntregaDate.toISOString().slice(0, 10);
        ventaModel.fechaEmision = this.saleModel.fechaEmisionDate.toISOString().slice(0, 19);
        ventaModel.parametroSaiDto.unidadNegocio = Number(this.saleModel.parametroSaiDto.unidadNegocio);
        ventaModel.usuarioVenta = this.authService.getUserId();
        if (this.saleModel.ventaId > 0) {
            this.saleService.onMerge(ventaModel).subscribe({
                next: (response: VentaModel) => {
                    this.submitted = false;
                    this.messageService.showSuccess(this.translateService.instant('succes'));
                    this.router.navigate(['/sales/sale-direct']);
                }
            });
        } else {
            this.saleService.onSave(ventaModel).subscribe({
                next: (response: ArchivoModel) => {
                    this.submitted = false;
                    this.downloadPDF(response);
                    this.messageService.showSuccess(this.translateService.instant('succes'));
                    this.router.navigate(['/sales/sale-direct']);
                }
            });
        }
    }

    private generateSalesReceipt(ventaId: number) {
        this.saleService.onGenerateSalesReceipt(ventaId).subscribe({
            next: (response: ArchivoModel) => {
                this.downloadPDF(response);
                this.messageService.showSuccess(this.translateService.instant('sale_receipt_sale_download_confirm'));
            }
        });
    }

    private loadTypeCoin(): void {
        this.domainService.onList(new DomainModelRequestSingle(new RequestHeaderModel(this.authService.getUser()),
            new DomainModel(T_DOMAIN_TBZ.CURRENT_TYPE))).subscribe({
            next: (response: DomainModelResponseList): void => {
                this.typeCurrent = response.domains.map((d: DomainModel) => {
                    return {label: d.domName, value: d.domValue, title: d.description};
                }).sort(((d, dc) => {
                    if (d.label < dc.label) return -1; // a va antes que b
                    if (d.label > dc.label) return 1;  // b va antes que a
                    return 0; // son iguales
                }));
            }
        })
    }

    private loadConfigDaysOfValidityOfVouchers(sale: VentaModel): void {
        this.domainService.onList(new DomainModelRequestSingle(
            new RequestHeaderModel(this.authService.getUser()),
            new DomainModel(T_DOMAIN_TBZ.CONFIG_SALE, null, T_DOMAIN_NAME.VIGENCIA_DE_VALES_DEFAULT))).subscribe({
            next: (response: DomainModelResponseList): void => {
                this.saleModel.vigenciaVales = parseInt(response.domains[0].domValue)
            }
        })
    }

    private findAccountingRecord() {
        this.accountingRecordService.onFindByVentaId(this.saleModel.ventaId).subscribe({
            next: (response: RegistroContableVentaModel) =>
                this.accountingRecordSale = response
        });
    }

    // #endregion SERVICES_ABM
    // #region EXTERNAL_EVENTS

    public getSumTotalVoucherCuts(): number {
        return Number(this.saleModel.corteVale.reduce((total: number, corteVale: CorteValeModel) =>
            total + Number((corteVale.cantidad * (corteVale.monto + corteVale.montoPorDescuento)).toFixed(2)), 0).toFixed(2));
    }

    // #region EXTERNAL_EVENTS

    // #region EVENTS
    public onClickOpenDialogAddVoucherCut(): void {
        this.newVoucherCut = new CorteValeModel(this.saleModel.ventaId, null, null, null, 0, 0);
        this.isVisibleDialogOfAddVoucher = true;
    }

    public onClickCloseDialogAddVoucherCut(): void {
        this.isVisibleDialogOfAddVoucher = false;
    }

    public onClickAddVoucherCut(): void {
        this.newVoucherCut.ventaCorteId = this.saleModel.corteVale.length;
        this.saleModel.corteVale.push(this.newVoucherCut);
        this.saleModel.totalVenta = this.getSumTotalVoucherCuts();
        this.saleModel.totalPagar = this.saleModel.totalVenta - this.saleModel.totalDescuento;
        this.isVisibleDialogOfAddVoucher = false;
    }

    public onSubmitSaveOrMergeSale(): void {
        if (!this.isSaleValid()) return;
        this.confirmationService.confirm({
            message: this.translateService.instant(this.saleModel.ventaId === 0 ? 'sale_confirm_save' : 'sale_confirm_merge'),
            icon: 'pi pi-info-circle',
            accept: () => this.saveOrMergeSale()
        });
    }

    public onClickBack(): void {
        this.router.navigate(['/sales/sale-direct']);
    }

    public onClickRemoveVoucherCut(rowData: CorteValeModel, index: number): void {
        if (this.isView) return;
        this.saleModel.corteVale.splice(index, 1);
        this.saleModel.totalVenta = this.getSumTotalVoucherCuts();
        this.saleModel.totalPagar = this.saleModel.totalVenta - this.saleModel.totalDescuento;
    }

    protected onDownloadReceiptSale(): void {
        this.generateSalesReceipt(this.saleModel.ventaId);
    }

    // #endregion EVENTS

    // #region EXTERNAL_FUNCTIONS
    private downloadPDF(response: ArchivoModel): void {
        if (!response.base64.includes('data:'))
            response.base64 = 'data:application/pdf;base64,' + response.base64;
        this.receiptSaleFileName = response.nombreArchivo;
        const url: string = response.base64.replace(/^data:application\/[^;]+/, 'data:application/octet-stream');
        const download: HTMLElement = document.getElementById('iddownloaddocs');
        $(download).attr('download', this.receiptSaleFileName);
        $(download).attr('href', url);
        download.click();
    }

    private isSaleValid() {
        let isSaleValid: boolean = true;
        try {
            if (this.isView) {
                this.messageService.showWarning(`La venta ${this.saleModel.ventaId} no puede ser editada ya que esta ${this.saleModel.estado}. Solo puede editar una venta en estado CREADA`);
                return false;
            }
            if (!this.canAddOrUpdateSale) {
                this.messageService.showError('No tienes configurado tu usuario para registrar ventas');
                isSaleValid = false;
            }
            if (!this.saleModel.clienteCodigo || !this.saleModel.clienteNombre) {
                this.messageService.showWarning('Cliente obligatorio');
                isSaleValid = false;
            }
            if (!this.saleModel.clienteTipoDocumento) {
                this.messageService.showWarning('El tipo de documento de facturación es obligatorio');
                isSaleValid = false;
            }
            if (!this.saleModel.clienteNit || !(this.saleModel.clienteNit.length >= 6) || !(this.saleModel.clienteNit.length < 20)) {
                this.messageService.showWarning('El NIT es obligatorio y minimo de 6 caracteres');
                isSaleValid = false;
            }
            if (!this.saleModel.clienteRazonSocial || !(this.saleModel.clienteRazonSocial.length >= 2) || !(this.saleModel.clienteRazonSocial.length < 150)) {
                this.messageService.showWarning('Razón social es obligatorio');
                isSaleValid = false;
            }
            if (this.saleModel.vigenciaVales == null || this.saleModel.vigenciaVales === 0) {
                this.messageService.showWarning('Vigencia de vales es obligatorio');
                isSaleValid = false;
            }
            if (this.saleModel.parametroSaiDto.unidadNegocio == null) {
                this.messageService.showWarning('Unidad de negocio es obligatorio');
                isSaleValid = false;
            }
            if (this.saleModel.parametroSaiDto.tipoCxC == null) {
                this.messageService.showWarning('Tipo cuenta por cobrar es obligatorio');
                isSaleValid = false;
            }
            if (this.saleModel.corteVale.length === 0) {
                this.messageService.showWarning('Una venta no puede estar sin cortes de vales');
                isSaleValid = false;
            }
            if (!this.saleModel.totalPagar || this.saleModel.totalPagar === 0) {
                this.messageService.showWarning('No puede registrar venta con importe 0');
                isSaleValid = false;
            }
            return isSaleValid;
        } catch (error) {
            console.error(error);
            this.messageService.showError('VENTA NO VÁLIDA');
            return false;
        }
    }
    // #endregion EXTERNAL_FUNCTIONS
}
