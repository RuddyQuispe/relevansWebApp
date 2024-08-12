import * as $ from 'jquery';
import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {VentaModel} from 'app/model/venta';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {decryptParam} from '@app/utils/params.security.utils';
import {VentaService} from '@services/sales/venta.service';
import {parseDateStringToDate} from '@app/utils/helpers';
import {ImpresionValesService} from '@services/sales/impresion-vales.service';
import {CorteValeImprimirModel, CorteValeModel} from '@models/corte-vale';
import {ConfirmationService, SelectItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {MensajeService} from '@app/error/mensaje.service';
import {ValeModel} from '@models/vale';
import {ArchivoModel} from '@models/archivo.model';
import {DomainModel, DomainModelRequestSingle, DomainModelResponseList} from "@models/domain";
import {RequestHeaderModel} from "@models/requestHeader.model";
import {T_DOMAIN_TBZ, TYPE_CORPORATIVE_SALE} from "@app/utils/constants";
import {DomainService} from "@services/template/domain.service";
import {AuthService} from "@services/auth.service";

@Component({
    selector: 'app-printer',
    templateUrl: './impresion-venta.component.html',
    styleUrls: ['./impresion-venta.component.scss']
})
export class ImpresionVentaComponent implements OnInit, AfterViewInit {
    public saleModel: VentaModel;

    public voucherCutsSelected: Array<CorteValeModel>;
    public voucherCutsToPrint: Array<CorteValeImprimirModel>;
    public loading: boolean;
    public rowsTables: number = Number(5);
    public isView: boolean;
    public pdfName: string;
    protected currentTypesOptions: Array<SelectItem> = [];

    constructor(private router: Router,
                private route: ActivatedRoute,
                private saleService: VentaService,
                private printerSaleService: ImpresionValesService,
                private authService: AuthService,
                private domainService: DomainService,
                private messageService: MensajeService,
                private confirmationService: ConfirmationService,
                private translateService: TranslateService,
                private changeDetectorRef: ChangeDetectorRef) {
    }

    public ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges();
    }


    public ngOnInit(): void {
        this.isView = false;
        this.pdfName = 'corte-sales.pdf';
        this.saleModel = new VentaModel();
        this.loadCurrentTypesOptions();
        this.voucherCutsSelected = new Array<CorteValeModel>();
        this.voucherCutsToPrint = new Array<CorteValeImprimirModel>();
        this.route.params.subscribe((params: Params): void => {
            const {id, isView} = JSON.parse(decryptParam(params.data));
            this.isView = isView;
            this.saleModel.ventaId = id;
            this.loadSale();
        });
    }

    // #region ABM_SERVICES

    private loadCurrentTypesOptions(): void {
        this.domainService.onList(new DomainModelRequestSingle(new RequestHeaderModel(this.authService.getUser()),
            new DomainModel(T_DOMAIN_TBZ.CURRENT_TYPE))).subscribe({
            next: (response: DomainModelResponseList) => {
                this.currentTypesOptions = response.domains.map((d: DomainModel) => {
                    return {label: d.domName, value: d.domValue, title: d.description};
                });
            }
        });
    }

    private loadSale(): void {
        this.loading = true;
        this.saleService.onFindById(this.saleModel.ventaId).subscribe({
            next: (response: VentaModel) => {
                debugger;
                this.saleModel = response;
                this.loading = false;
                this.voucherCutsSelected = [];
                this.voucherCutsToPrint = [];
                if (this.saleModel.tipoVentaCorporativa === TYPE_CORPORATIVE_SALE.NOMINAL)
                    this.getTemplateFileToDownload(this.saleModel.ventaId);
            },
            error: err => this.loading = false
        });
    }

    private printVoucherCutsSelected(): void {
        this.printerSaleService.onPrint(this.voucherCutsToPrint).subscribe({
            next: (response: ArchivoModel) => {
                if (!response.base64.includes('data:')) {
                    response.base64 = 'data:application/pdf;base64,' + response.base64;
                }
                this.pdfName = response.nombreArchivo;
                const url: string = response.base64.replace(/^data:application\/[^;]+/, 'data:application/octet-stream');
                const download: HTMLElement = document.getElementById('iddownloaddocs');
                $(download).attr('download', this.pdfName);
                $(download).attr('href', url);
                download.click();
                this.messageService.showSuccess(this.translateService.instant('sales_printer_print_success'));
                this.loadSale();
            }
        });
    }

    private getTemplateFileToDownload(ventaId: number) {
        this.saleService.onDownloadTemplate(ventaId).subscribe({
            next: (response: ArchivoModel): void => {
                if (!response.base64 && !response.nombreArchivo)
                    this.messageService.showError(`No es posible imprimir los cortes de vales de esta venta ${this.saleModel.tipoVentaCorporativa} hasta que se haya cargado la plantilla de beneficiarios correspondiente.`);
            }
        });
    }

    // #endregion ABM_SERVICES

    // #region EVENTS
    public onSubmit(): void {
        if (!this.validateVoucherCutsToPrint()) return;
        this.confirmationService.confirm({
            message: this.translateService.instant('sales_printer_confirm_print'),
            header: this.translateService.instant('sales_printer_confirm_print_header'),
            icon: 'pi pi-info-circle',
            accept: () => this.printVoucherCutsSelected()
        });
    }

    public onEventChangeVoucherCutValue(event: { corteValeId: number; ventaId: number; cantidad?: number }): void {

        // validar la cantidad a imprimir con mensaje de advertecia
        const voucherCut: Array<CorteValeModel> = this.voucherCutsSelected.filter(vc => vc.ventaCorteId === event.corteValeId);
        voucherCut.forEach(vc => {
            if ((vc.cantidad - vc.impreso) < event.cantidad) {
                this.messageService.showWarning('La cantidad registrada excede a la cantidad disponible del corte de vale');
                return;
            }
        });
        if (!this.voucherCutsToPrint.some(vp => vp.ventaId === event.ventaId && vp.corteId === event.corteValeId)) {
            this.voucherCutsToPrint.push(new CorteValeImprimirModel(event.corteValeId, event.cantidad, event.ventaId));
            return;
        }
        this.voucherCutsToPrint.forEach(vp => {
            if (vp.corteId === event.corteValeId && vp.ventaId === event.ventaId) {
                vp.cantidad = event.cantidad;
            }
        });
    }

    public async onClickBack(): Promise<void> {
        await this.router.navigate(['/sales/sales-print']);
    }

    // #endregion EVENTS

    // #region EXTERNAL_FUNCTIONS

    public validateVoucherCutsToPrint(): boolean {
        let isValid: boolean = true;
        if (this.voucherCutsToPrint.length === 0) {
            this.messageService.showError('No hay cortes de vale a imprimir');
            isValid = false;
        }
        for (const cut of this.voucherCutsToPrint) {
            const vc = this.voucherCutsSelected.find(x => x.ventaCorteId === cut.corteId);
            if (cut.cantidad == 0) {
                this.messageService.showWarning(`El corte de vale con monto: ${vc.monto + vc.montoPorDescuento} no puede ser impreso con una cantidad de 0.`)
                isValid = false;
            }
            if ((vc.cantidad - vc.impreso) < cut.cantidad) {
                this.messageService.showWarning(`La cantidad a imprimir para este corte de vale con monto: ${vc.monto + vc.montoPorDescuento} excede la cantidad disponible para su impresión.`);
                isValid = false;
            }
        }
        return isValid;
    }

    // #endregion EXTERNAL_FUNCTIONS

    public parseVoucherModel(voucherCut: CorteValeModel): ValeModel {
        return new ValeModel(
            0,
            'PRUEBA BENEFICIARIO',
            voucherCut.ventaCorteId,
            this.saleModel.clienteNombre,
            'PRUEBA',
            new Date(this.saleModel.fechaEmision).toISOString().slice(0, 19),
            new Date(this.saleModel.fechaEntrega).toISOString().slice(0, 19),
            '0000000000',
            voucherCut.monto,
            this.saleModel.ventaId,
            this.saleModel.moneda
        );
    }
}
