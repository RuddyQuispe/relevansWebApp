import * as $ from 'jquery';
import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ConfirmationService, SelectItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

import {VentaModel} from 'app/model/venta';
import {decryptParam} from '@app/utils/params.security.utils';
import {CONFIG} from '@config/config';
import {MensajeService} from '@app/error/mensaje.service';
import {CorteValeModel} from '@models/corte-vale/corte.vale.model';
import {VentaService} from '@services/sales/venta.service';
import {
    ACCOUNTING_RECORD_SALE,
    DOCUMENT_TYPE_SALE_BILLING,
    FORM_DISCOUNT_SALE,
    SEARCH_TYPE, T_DOMAIN_NAME,
    T_DOMAIN_TBZ, TYPE_CORPORATIVE_SALE,
    TYPE_DISCOUNT_SALE,
    TYPE_PAYMENT_SALE
} from '@app/utils/constants';
import {DomainService} from '@services/template/domain.service';
import {DomainModel, DomainModelRequestSingle, DomainModelResponseList} from '@models/domain';
import {AuthService} from '@services/auth.service';
import {RequestHeaderModel} from '@models/requestHeader.model';
import {GenericSearchResponseModel} from '@models/generic-response';
import {parseDateStringToDate} from '@app/utils/helpers';
import {ArchivoModel} from '@models/archivo.model';
import {UserDatosAdicionalesByTypeModelRequest, UserParametrosSaiModel} from "@models/parametros-sai";
import {ParametrosSaiService} from "@services/admin/parametros-sai.service";
import {RegistroContableService} from "@services/admin/registro-contable.service";
import {RegistroContableVentaModel} from "@models/registro-contable";
import {forkJoin} from "rxjs";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-venta',
    templateUrl: './venta.component.html',
    styleUrls: ['./venta.component.scss']
})
export class VentaComponent implements OnInit, AfterViewInit {

    public DATE_NOW: Date = new Date();

    public saleModel: VentaModel;
    public newVoucherCut: CorteValeModel;
    protected accountingRecordSale?: RegistroContableVentaModel;

    public loading: boolean;
    public isView: boolean;
    public cmpReq: string;
    public cmpMin: string;
    public fromPageCalled: string;
    protected canAddOrUpdateSale: boolean;
    public paymentTypeOptions: SelectItem[] = [];
    public discountTypeOptions: SelectItem[] = [];
    public applyDiscountTypeOptions: SelectItem[] = [];
    public businessUnitOptions: SelectItem[] = [];
    public cxcTypeOptions: SelectItem[] = [];
    public typeCurrent: SelectItem[] = [];
    protected optionsTypeSaleCorp: SelectItem[] = [];
    public rowsTables: number = Number(CONFIG.ROWS_TABLE);
    protected readonly SEARCH_TYPE = SEARCH_TYPE;
    public isVisibleDialogFindClients: boolean = false;
    public isVisibleDialogOfAddVoucher: boolean = false;
    public submittedVoucherAdd: boolean;
    public submitted: boolean;
    protected receiptSaleFileName: string;
    protected accessDiscountEdit: boolean = Boolean(false);
    protected isVisibleDialogOfSetCountVouchersForDiscountMethod: boolean = Boolean(false);
    protected readonly DOCUMENT_TYPE_SALE_BILLING = DOCUMENT_TYPE_SALE_BILLING;
    protected readonly ACCOUNTING_RECORD_SALE = ACCOUNTING_RECORD_SALE;
    protected previousPaymentMethodDiscount: string;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private translateService: TranslateService,
                private messageService: MensajeService,
                private confirmationService: ConfirmationService,
                private changeDetector: ChangeDetectorRef,
                private saleService: VentaService,
                private domainService: DomainService,
                private authService: AuthService,
                private saiParameterUserService: ParametrosSaiService,
                private accountingRecordService: RegistroContableService,
                private datePipe: DatePipe) {
    }

    public ngAfterViewInit(): void {
        this.changeDetector.detectChanges();
    }

    public ngOnInit(): void {
        // initialize options values from translateService
        this.cmpReq = this.translateService.instant('cmpReq');
        this.cmpMin = this.translateService.instant('cmpMin');
        this.loading = false;
        this.submitted = false;
        this.canAddOrUpdateSale = true;

        this.loadPaymentTypeOptions();
        this.loadTypeSaleCorpOptions();
        this.loadDiscountTypeOptions();
        this.loadApplyDiscountTypeOptions();
        this.loadUserDatosAdicionalesOptions(this.authService.getUserId());
        this.loadTypeCoin();

        // get params to edit, readonly or register
        this.route.params.subscribe((params: Params): void => {
            const {id, isView, from} = JSON.parse(decryptParam(params.data));
            this.isView = isView;
            this.fromPageCalled = from;
            this.newVoucherCut = new CorteValeModel();
            this.saleModel = new VentaModel();
            this.saleModel.ventaId = id;
            this.loadConfigDaysOfValidityOfVouchers();
            this.previousPaymentMethodDiscount = this.saleModel.descuentoFormaAplicacion = this.applyDiscountTypeOptions[0].value;
            this.loadSaiParametersUser();
        });
        if (!this.saleModel.ventaId || this.saleModel.ventaId === 0) return;
        this.findSale(this.saleModel.ventaId);
    }

    // #region SERVICES_ABM
    private loadUserDatosAdicionalesOptions(userId: number): void {
        forkJoin([
            this.saiParameterUserService.onListTypeAccountByUser(new UserDatosAdicionalesByTypeModelRequest(userId, T_DOMAIN_NAME.UNIDAD_NEGOCIO)),
            this.saiParameterUserService.onListTypeAccountByUser(new UserDatosAdicionalesByTypeModelRequest(userId, T_DOMAIN_NAME.TIPO_CXC))
        ]).subscribe({
            next: ([businessUnits, cxcTypes]): void => {
                this.businessUnitOptions = [{label: this.translateService.instant('selectList'), value: null}];
                this.businessUnitOptions.push(...businessUnits.map(u => {
                    return {label: u.descripcion, value: u.codigoSai};
                }));
                this.cxcTypeOptions = [{label: this.translateService.instant('selectList'), value: null}];
                this.cxcTypeOptions.push(...cxcTypes.map(u => {
                    return {label: u.descripcion, value: u.codigoSai};
                }))
            }
        });
    }

    private findSale(id: number): void {
        this.saleService.onFindById(id).subscribe({
            next: (response: VentaModel) => {
                debugger;
                this.saleModel = response;
                this.saleModel.moneda = response.moneda.toString()
                this.saleModel.fechaEmisionDate = parseDateStringToDate(this.saleModel.fechaEmision);
                this.saleModel.fechaEntregaDate = parseDateStringToDate(this.saleModel.fechaEntrega);
                this.previousPaymentMethodDiscount = this.saleModel.descuentoFormaAplicacion;
                this.saleModel.parametroSaiDto.unidadNegocio = this.saleModel.parametroSaiDto.unidadNegocio.toString();
                this.saleModel.parametroSaiDto.tipoCxC = this.saleModel.parametroSaiDto.tipoCxC.toString();
                this.loadUserDatosAdicionalesOptions(response.usuarioVenta);
                this.findAccountingRecord();
            }
        });
    }

    private generateSalesReceipt(ventaId: number): void {
        this.saleService.onGenerateSalesReceipt(ventaId).subscribe({
            next: (response: ArchivoModel) => {
                if (!response.base64.includes('data:'))
                    response.base64 = 'data:application/pdf;base64,' + response.base64;
                this.receiptSaleFileName = response.nombreArchivo;
                const url: string = response.base64.replace(/^data:application\/[^;]+/, 'data:application/octet-stream');
                const download: HTMLElement = document.getElementById('iddownloaddocs');
                $(download).attr('download', this.receiptSaleFileName);
                $(download).attr('href', url);
                download.click();
                this.messageService.showSuccess(this.translateService.instant('sale_receipt_sale_download_confirm'));
            }
        });
    }

    private saveOrMergeSale(): void {
        let saleModelOriginal: VentaModel = VentaModel.clone(this.saleModel);
        saleModelOriginal.fechaEmision = this.saleModel.fechaEmisionDate.toISOString().slice(0, 19);
        saleModelOriginal.fechaEntrega = this.saleModel.fechaEntregaDate.toISOString().slice(0, 10);
        saleModelOriginal.parametroSaiDto.unidadNegocio = Number(this.saleModel.parametroSaiDto.unidadNegocio);
        saleModelOriginal.usuarioVenta = this.authService.getUserId();
        // se debe organizar los cortes de vales con la aplicacion de forma de descuento
        if (this.saleModel.ventaId > 0) {
            this.saleService.onMerge(saleModelOriginal).subscribe({
                next: (response: VentaModel) => {
                    this.submitted = false;
                    this.messageService.showSuccess(this.translateService.instant('succes'));
                    this.router.navigate(['/sales/sale']);
                }
            });
        } else {
            this.saleService.onSave(saleModelOriginal).subscribe({
                next: (response: ArchivoModel) => {
                    this.submitted = false;
                    if (!response.base64.includes('data:'))
                        response.base64 = 'data:application/xlsx;base64,' + response.base64;
                    this.receiptSaleFileName = response.nombreArchivo;
                    const url: string = response.base64.replace(/^data:application\/[^;]+/, 'data:application/octet-stream');
                    const download: HTMLElement = document.getElementById('iddownloaddocs');
                    $(download).attr('download', this.receiptSaleFileName);
                    $(download).attr('href', url);
                    download.click();
                    this.messageService.showSuccess(this.translateService.instant('succes'));
                    this.router.navigate(['/sales/sale']);
                }
            });
        }
    }

    private loadSaiParametersUser() {
        this.saiParameterUserService.onFindByAgenda(this.authService.getUserId()).subscribe({
            next: (response: UserParametrosSaiModel): void => {
                if (!response.codigoUsuarioSai || !response.codigoUsuarioSaiDesc) {
                    this.messageService.showError('El usuario ' + this.authService.getUser() + ' no puede realizar ventas sin tener configurador los parametros SAI.')
                    this.canAddOrUpdateSale = false;
                }
            }
        });
    }

    private loadConfigDaysOfValidityOfVouchers(): void {
        this.domainService.onList(new DomainModelRequestSingle(
            new RequestHeaderModel(this.authService.getUser()),
            new DomainModel(T_DOMAIN_TBZ.CONFIG_SALE, null, T_DOMAIN_NAME.VIGENCIA_DE_VALES_DEFAULT))).subscribe({
            next: (response: DomainModelResponseList): void => {
                this.saleModel.vigenciaVales = parseInt(response.domains[0].domValue)
            }
        })
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

    private findAccountingRecord(): void {
        this.accountingRecordService.onFindByVentaId(this.saleModel.ventaId).subscribe({
            next: (response: RegistroContableVentaModel) =>
                this.accountingRecordSale = response
        });
    }

    // #endregion SERVICES_ABM

    // #region EXTERNAL_EVENTS

    public eventCloseDialogFindClients(event: boolean): void {
        if (event === true) {
            this.isVisibleDialogFindClients = false;
        }
    }

    public eventSelectClient(event: GenericSearchResponseModel): void {
        this.saleModel.clienteNombre = event.descripcion;
        this.saleModel.clienteCodigo = event.codigo;
    }

    // #region EXTERNAL_EVENTS

    // #region EVENTS

    public onClickShowModalSearchClient(): void {
        this.isVisibleDialogFindClients = true;
    }

    public onSubmitSaveOrMergeSale(): void {
        if (!this.isValidSale()) return;
        this.confirmationService.confirm({
            message: this.translateService.instant(this.saleModel.ventaId === 0 ? 'sale_confirm_save' : 'sale_confirm_merge'),
            icon: 'pi pi-info-circle',
            accept: () => this.saveOrMergeSale()
        });
    }

    public onClickBack(): void {
        if (this.fromPageCalled === 'V')
            this.router.navigate(['/sales/sale']);
        else if (this.fromPageCalled === 'B')
            this.router.navigate(['/sales/template']);
        else this.router.navigate(['/sales/sale']);
    }

    public onClickShowDialogAddVoucherCut(): void {
        this.newVoucherCut = new CorteValeModel(this.saleModel.ventaId, null, null, null, 0, 0);
        this.isVisibleDialogOfAddVoucher = true;
    }

    public onClickCloseDialogAddVoucherCut(): void {
        this.isVisibleDialogOfAddVoucher = false;
    }

    public onClickAddVoucherCut(): void {
        this.saleModel.corteVale.push(new CorteValeModel(this.newVoucherCut.ventaId, this.newVoucherCut.ventaCorteId, Number(this.newVoucherCut.cantidad), Number(this.newVoucherCut.monto), Number(this.newVoucherCut.montoPorDescuento),
            Number(this.newVoucherCut.impreso)));
        this.updateDiscountAndTotalToPayment();
        this.isVisibleDialogOfAddVoucher = false;
    }

    public onClickRemoveVoucherCut(rowData: CorteValeModel, index: number): void {
        if (this.isView) return;
        if (!this.isValidRemoveVoucher(rowData)) return;
        this.saleModel.corteVale.splice(index, 1);
        if (this.saleModel.descuentoFormaAplicacion === FORM_DISCOUNT_SALE.TYPE_APPLY_DISCOUNT_ADDITIONAL_VOUCHER_DISCOUNT) {
            this.saleModel.descuentoFormaAplicacion = FORM_DISCOUNT_SALE.TYPE_APPLY_DISCOUNT_ON_PAYMENT_AMOUNT;
            this.messageService.showInfo('Se modifico la forma de aplicacion de descuento sobre el monto de pago ya que el corte de vale adicional no concuerda con el monto de venta')
        }
        this.updateDiscountAndTotalToPayment();
    }

    public onChangeDiscountTypeApply = (): void => {
        if (this.saleModel.descuentoFormaAplicacion === FORM_DISCOUNT_SALE.TYPE_APPLY_DISCOUNT_ADDITIONAL_VOUCHER_DISCOUNT &&
            (!this.saleModel.descuentoValor || this.saleModel.descuentoValor == 0)) {
            this.messageService.showWarning(`no se puede applicar la forma de descuento ${FORM_DISCOUNT_SALE.TYPE_APPLY_DISCOUNT_ADDITIONAL_VOUCHER_DISCOUNT} con valor de descuento ${this.saleModel.descuentoValor ?? 'vacio'}`);
            this.saleModel.totalDescuento = 0;
            return;
        }
        if (this.saleModel.descuentoFormaAplicacion === FORM_DISCOUNT_SALE.TYPE_APPLY_DISCOUNT_ADDITIONAL_VOUCHER_DISCOUNT
            && this.saleModel.descuentoValor > 0 && this.saleModel.totalDescuento > 0) {
            // const x = this.previousPaymentMethodDiscount;
            // this.previousPaymentMethodDiscount = this.saleModel.descuentoFormaAplicacion;
            this.openDialogAddVoucherCutForDiscount();
        } else {
            this.updateDiscountAndTotalToPayment();
        }
    }

    public onChangeDiscountType = (): void => {
        this.updateDiscountAndTotalToPayment();
    }
    public onChangeValueDiscount = (): void => {
        if (this.saleModel.descuentoValor == undefined)
            this.saleModel.descuentoValor = 0;
        if (this.saleModel.descuentoFormaAplicacion === FORM_DISCOUNT_SALE.TYPE_APPLY_DISCOUNT_ADDITIONAL_VOUCHER_DISCOUNT) {
            this.saleModel.descuentoFormaAplicacion = FORM_DISCOUNT_SALE.TYPE_APPLY_DISCOUNT_ON_PAYMENT_AMOUNT;
        }
        this.updateDiscountAndTotalToPayment();
    }

    protected onDownloadReceiptSale = (): void => this.generateSalesReceipt(this.saleModel.ventaId)

    protected onClickAddVoucherCutForDiscount(): void {
        this.updateDiscountAndTotalToPayment();
        this.closeDialogAddVoucherCutForDiscount();
    }

    protected onClickCloseDialogOfSetCountVouchersForDiscountMethod(): void {
        this.saleModel.descuentoFormaAplicacion = this.previousPaymentMethodDiscount;
        this.closeDialogAddVoucherCutForDiscount();
    }

    // #endregion EVENTS

    // #region EXTERNAL_FUNCTIONS
    private loadPaymentTypeOptions(): void {
        this.paymentTypeOptions = [
            {label: TYPE_PAYMENT_SALE.CREDIT, value: TYPE_PAYMENT_SALE.CREDIT},
            {label: TYPE_PAYMENT_SALE.COUNTED, value: TYPE_PAYMENT_SALE.COUNTED}
        ];
    }

    private loadTypeSaleCorpOptions(): void {
        this.optionsTypeSaleCorp = Object.keys(TYPE_CORPORATIVE_SALE).map(key => {
            return {label: TYPE_CORPORATIVE_SALE[key], value: TYPE_CORPORATIVE_SALE[key]}
        });
    }

    private loadDiscountTypeOptions(): void {
        this.discountTypeOptions = [
            {label: TYPE_DISCOUNT_SALE.AMOUNT, value: TYPE_DISCOUNT_SALE.AMOUNT},
            {label: TYPE_DISCOUNT_SALE.PERCENTAGE, value: TYPE_DISCOUNT_SALE.PERCENTAGE}
        ];
    }

    private loadApplyDiscountTypeOptions(): void {
        this.applyDiscountTypeOptions = [
            {
                label: FORM_DISCOUNT_SALE.TYPE_APPLY_DISCOUNT_ON_PAYMENT_AMOUNT,
                value: FORM_DISCOUNT_SALE.TYPE_APPLY_DISCOUNT_ON_PAYMENT_AMOUNT
            },
            {
                label: FORM_DISCOUNT_SALE.TYPE_APPLY_DISCOUNT_ADDITIONAL_VOUCHER_DISCOUNT,
                value: FORM_DISCOUNT_SALE.TYPE_APPLY_DISCOUNT_ADDITIONAL_VOUCHER_DISCOUNT
            },
            {
                label: FORM_DISCOUNT_SALE.TYPE_APPLY_DISCOUNT_ON_VOUCHER_AMOUNT,
                value: FORM_DISCOUNT_SALE.TYPE_APPLY_DISCOUNT_ON_VOUCHER_AMOUNT
            }
        ];
    }

    public updateDiscountAndTotalToPayment(): void {
        // REVERTIR
        // revertir la forma de descuento
        this.saleModel.corteVale.forEach(v => v.montoPorDescuento = 0);
        // aplica para la segunda forma de descuento Descuento Vale adicional, se debe eliminar el corte de vale adicional (que esta con monto y montoporDescuento 0)
        this.saleModel.corteVale = this.saleModel.corteVale.filter(v =>
            !(v.montoPorDescuento == 0 && v.monto == 0 && v.cantidad > 0));

        // ACTUALIZACION
        // verificar on change descuento valor y tipo de descuento (monto/porcentual)
        // si el tipo de descuento es porcentual y el valor de descuento sobrepasa de 100 (100%)
        if (this.saleModel.descuentoTipo === TYPE_DISCOUNT_SALE.PERCENTAGE &&
            (this.saleModel.descuentoValor > 100 || this.saleModel.descuentoValor < 0)) {
            this.messageService.showWarning(this.translateService.instant('sale_voucher_discount_porcentual_warning'));
            return;
        }
        // si el tipo de descuento es porcentual, calcular el % del monto
        if (this.saleModel.descuentoTipo === TYPE_DISCOUNT_SALE.PERCENTAGE)
            this.saleModel.totalDescuento = Number((this.getSumTotalVoucherCuts() * (this.saleModel.descuentoValor / 100)).toFixed(2));
        else
            this.saleModel.totalDescuento = this.saleModel.descuentoValor;

        // verificar forma de aplicar el descuento
        switch (this.saleModel.descuentoFormaAplicacion) {
            /**
             * Descuento sobre el monto de pago
             * el descuento se aplica de manera normal, importe = monto - descuento
             */
            case FORM_DISCOUNT_SALE.TYPE_APPLY_DISCOUNT_ON_PAYMENT_AMOUNT:
                break;
            /**
             * Descuento Vale adicional
             * Agregar 1 nuevo vale con el valor de descuento debe buscar un corte de vale con el monto igual
             */
            case FORM_DISCOUNT_SALE.TYPE_APPLY_DISCOUNT_ADDITIONAL_VOUCHER_DISCOUNT:
                // utilizamos this.newVoucherCut porque desde ahi se crea el nuevo corte de respecto al desceunto
                const saleEqualDiscount: CorteValeModel = new CorteValeModel(this.saleModel.ventaId,
                    0, this.newVoucherCut.cantidad, this.newVoucherCut.monto, this.newVoucherCut.montoPorDescuento, null);
                this.saleModel.corteVale.push(saleEqualDiscount);
                break;
            /**
             * Descuento Sobre monto de Vales
             * se debe distribuir el descuento por corte de vale y en cada corte de vale
             * y en cada vale de un corte se distribuye el descuento por vale
             */
            case FORM_DISCOUNT_SALE.TYPE_APPLY_DISCOUNT_ON_VOUCHER_AMOUNT:
                const discountPartitioning: number = this.saleModel.totalDescuento / this.saleModel.corteVale.length;
                this.saleModel.corteVale.forEach(c => {
                    const discountEachVoucher: number = discountPartitioning / c.cantidad;
                    c.montoPorDescuento = discountEachVoucher;
                })
                break;
        }
        this.saleModel.totalVenta = this.getSumTotalVoucherCuts() + this.getSumTotalVoucherCutsForAmountForDiscount();
        this.saleModel.totalPagar = this.saleModel.totalVenta - this.saleModel.totalDescuento;
        if (this.saleModel.totalPagar <= 0)
            this.messageService.showError(`el total a pagar ${this.saleModel.totalPagar} no es válido`);
    }

    protected getCurrent = (): string =>
        this.typeCurrent.filter(x => x.value == this.saleModel.moneda)[0]?.title ?? '-'

    public getTypeDiscountSymbol = (): string =>
        this.saleModel.descuentoTipo === TYPE_DISCOUNT_SALE.PERCENTAGE ? '%' : this.getCurrent()

    public getSumTotalVoucherCuts(): number {
        return Number(this.saleModel.corteVale.reduce((total: number, corteVale: CorteValeModel) =>
            total + Number((corteVale.cantidad * corteVale.monto).toFixed(2)), 0).toFixed(2));
    }

    public getSumTotalVoucherCutsForAmountForDiscount(): number {
        return Number(this.saleModel.corteVale.reduce((total: number, corteVale: CorteValeModel) =>
            total + Number((corteVale.cantidad * corteVale.montoPorDescuento).toFixed(2)), 0).toFixed(2));
    }

    private openDialogAddVoucherCutForDiscount() {
        this.newVoucherCut = new CorteValeModel(this.saleModel.ventaId, 0, null, 0, null, 0);
        this.newVoucherCut.totalMontoAsignado = this.saleModel.totalDescuento;
        this.isVisibleDialogOfSetCountVouchersForDiscountMethod = true;
    }

    private closeDialogAddVoucherCutForDiscount() {
        this.newVoucherCut = new CorteValeModel();
        this.isVisibleDialogOfSetCountVouchersForDiscountMethod = false;
    }

    private isValidSale(): boolean {
        try {
            if (this.isView) {
                this.messageService.showWarning(`La venta ${this.saleModel.ventaId} no puede ser editada ya que esta ${this.saleModel.estado}. Solo puede editar una venta en estado CREADA`);
                return false;
            }
            let isSaleValid: boolean = true;
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
            if (this.saleModel.formaPagoPlazo == null) {
                this.messageService.showWarning('Plazo días de forma de pago es obligatorio');
                isSaleValid = false;
            }
            if (this.saleModel.vigenciaVales == null || this.saleModel.vigenciaVales === 0) {
                this.messageService.showWarning('Vigencia de vales es obligatorio');
                isSaleValid = false;
            }
            if (!this.saleModel.parametroSaiDto.unidadNegocio) {
                this.messageService.showWarning('Unidad de negocio es obligatorio');
                isSaleValid = false;
            }
            if (!this.saleModel.parametroSaiDto.tipoCxC) {
                this.messageService.showWarning('Tipo cuenta por cobrar es obligatorio');
                isSaleValid = false;
            }
            if (this.saleModel.corteVale.length === 0) {
                this.messageService.showWarning('Una venta no puede estar sin cortes de vales');
                isSaleValid = false;
            }
            if (this.saleModel.totalPagar <= 0) {
                this.messageService.showError('El total a pagar no puede ser negativo o valor 0');
                isSaleValid = false;
            }
            return isSaleValid;
        } catch (error) {
            console.error(error);
            this.messageService.showError('VENTA NO VÁLIDA');
            return false;
        }
    }

    private isValidRemoveVoucher(corteValeModel: CorteValeModel) {
        let isValid: boolean = true;
        if (corteValeModel.montoPorDescuento > 0 && this.saleModel.descuentoFormaAplicacion === FORM_DISCOUNT_SALE.TYPE_APPLY_DISCOUNT_ADDITIONAL_VOUCHER_DISCOUNT) {
            this.messageService.showWarning('No puede eliminar el corte de vale ya que es el parte del DESCUENTO VALE ADICIONAL')
            isValid = false;
        }
        return isValid;
    }

    // #endregion EXTERNAL_FUNCTIONS
}
