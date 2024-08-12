import * as $ from 'jquery';
import {Component, OnInit} from '@angular/core';
import {ValeModel} from '@models/vale';
import {CorteValeModel} from '@models/corte-vale';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {decryptParam} from '@app/utils/params.security.utils';
import {ValeService} from '@services/vouchers/vale.service';
import {MensajeService} from '@app/error/mensaje.service';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {ArchivoModel} from '@models/archivo.model';

@Component({
    selector: 'app-printer-voucher',
    templateUrl: './printer-voucher.component.html',
    styleUrls: ['./printer-voucher.component.scss']
})
export class PrinterVoucherComponent implements OnInit {

    public voucherModelToPrint: ValeModel;

    public isView: boolean;
    public pdfName: string;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private voucherService: ValeService,
                private messageService: MensajeService,
                private translateService: TranslateService,
                private confirmationService: ConfirmationService) {
        this.pdfName = 'impresion-vale.pdf';
        this.route.params.subscribe((params: Params): void => {
            const {id, isView} = JSON.parse(decryptParam(params.data));
            this.isView = isView;
            this.voucherModelToPrint = new ValeModel();
            this.voucherModelToPrint.valeId = id || 0;
        });
    }

    ngOnInit(): void {
        this.findVoucher(this.voucherModelToPrint.valeId);
    }

    // #region ABM_SERVICES

    private findVoucher(valeId: number): void {
        this.voucherService.onFindById(valeId).subscribe({
            next: (response: ValeModel) => {
                this.voucherModelToPrint = response;
            }
        });
    }

    private printVoucher(): void {
        this.voucherService.onPrintVouchers([this.voucherModelToPrint]).subscribe({
            next: (response: ArchivoModel) => {
                if (!response.base64.includes('data:'))
                    response.base64 = 'data:application/pdf;base64,' + response.base64;
                this.pdfName = response.nombreArchivo;
                const url: string = response.base64.replace(/^data:application\/[^;]+/, 'data:application/octet-stream');
                const download: HTMLElement = document.getElementById('iddownloaddocs');
                $(download).attr('download', this.pdfName);
                $(download).attr('href', url);
                download.click();
                this.messageService.showSuccess(this.translateService.instant('succes'));
                setTimeout(() => this.router.navigate(['/vouchers/division']), 2000);
            }
        });
    }

    // #endregion ABM_SERVICES

    // #region EVENT

    public onSubmitToPrintVoucher(): void {
        this.confirmationService.confirm({
            header: this.translateService.instant('voucher_printer_confirm_dialog_header'),
            message: this.translateService.instant('voucher_printer_confirm_dialog_body'),
            icon: 'pi pi-times-circle',
            accept: () => this.printVoucher(),
        });
    }

    public onClickBack = () =>
        this.router.navigate(['/vouchers/printer'])

    // #endregion EVENT

    // #region EXTERNAL_FUNCTIONS

    public onEventChangeVoucherCutValue(event: any): void {
    }

    public parseVoucherCut(voucherModelToPrint: ValeModel): CorteValeModel {
        return new CorteValeModel(null,
            voucherModelToPrint.monto,
            null,
            voucherModelToPrint.corteId,
            voucherModelToPrint.ventaId,
            null
        );
    }

    // #endregion EXTERNAL_FUNCTIONS
}
