import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
    ConsumoValesRequestModel,
    ConsumoValesResponseModel,
    ReservaConsumoValesRequestModel,
    ReservaConsumoValesResponseModel,
    ReservaValeRequestModel,
    ReservaValeResponseModel,
    ValeModel
} from '@models/vale';
import {CorteValeModel} from '@models/corte-vale';
import {ValeService} from '@services/vouchers/vale.service';
import {MensajeService} from '@app/error/mensaje.service';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from "@services/auth.service";
import {STATUS_CONSUMER_VOUCHER} from "@app/utils/constants";
import {debounceTime, Subject, Subscription} from "rxjs";
import {DatePipe} from "@angular/common";
import {ConsumoService} from "@services/vouchers/consumo.service";

@Component({
    selector: 'app-consumer-voucher',
    templateUrl: './consumer-voucher.component.html',
    styleUrls: ['./consumer-voucher.component.scss']
})
export class ConsumerVoucherComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('hashCode') codeInput: ElementRef;
    protected voucherModel: ValeModel;

    protected hashCodeVoucherScannedOriginal: string = '';
    protected isScanning: boolean;
    public debounceScannerInput: Subject<string> = new Subject<string>();
    public debounceSubscriptionScannerInput?: Subscription;
    protected readonly STATUS_CONSUMER_VOUCHER = STATUS_CONSUMER_VOUCHER;

    constructor(private datePipe: DatePipe,
                private authService: AuthService,
                private messageService: MensajeService,
                private confirmationService: ConfirmationService,
                private translateService: TranslateService,
                private consumerVoucherService: ConsumoService,
                private voucherService: ValeService,
                private detectorChangesService: ChangeDetectorRef) {
    }

    public ngOnDestroy(): void {
        this.debounceSubscriptionScannerInput.unsubscribe();
    }

    public ngOnInit(): void {
        this.hashCodeVoucherScannedOriginal = '';
        this.debounceSubscriptionScannerInput = this.debounceScannerInput
            .pipe(debounceTime(100))
            .subscribe(value => {
                this.codeInput.nativeElement.value = '';
                if (this.isScanning) {
                    this.isScanning = false;
                    if (!this.isValidHash(value)) {
                        return;
                    }
                    this.hashCodeVoucherScannedOriginal = value;
                    console.log(this.hashCodeVoucherScannedOriginal);
                    this.findVoucherByHash();
                }
            })
    }

    public ngAfterViewInit(): void {
        this.initScannerDetection();
        this.detectorChangesService.detectChanges();
    }

    // #region ABM_SERVICE
    private findVoucherByHash(): void {
        this.voucherService.onFindByHash(this.hashCodeVoucherScannedOriginal).subscribe({
            next: (response: ValeModel): void => {
                this.voucherModel = response;
                this.messageService.showSuccess(this.translateService.instant('voucher_consumer_process_find_success'));
            }
        });
    }

    private confirmVoucherConsumer(consumerVouchersConfirmation: ConsumoValesRequestModel): void {
        this.consumerVoucherService.onConfirmConsumerVouchers(consumerVouchersConfirmation).subscribe({
            next: (response: ConsumoValesResponseModel): void => {
                response.list.forEach(c => {
                    if (c.codigo === '0') {
                        this.messageService.showSuccess(c.descripcion);
                        this.findVoucherByHash();
                    } else {
                        this.messageService.showError(c.descripcion);
                    }
                });
            }
        });
    }

    private reserveVoucherConsumer() {
        // TODO: identificar la caja del usuario donde se consume el vale
        this.consumerVoucherService.onReserveConsumerVouchers(new ReservaConsumoValesRequestModel(
            `WEB${this.datePipe.transform(new Date(), 'yyyyMMddHHmmss', 'GMT-4', 'es-BO')}`,
            this.datePipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss", 'GMT-4', 'es-BO'),
            'CAJA WEB1',
            this.authService.getUser(),
            [new ReservaValeRequestModel(
                this.hashCodeVoucherScannedOriginal,
                this.voucherModel.monto
            )])).subscribe({
            next: (response: ReservaConsumoValesResponseModel): void => {
                response.list.forEach((reserveVoucher: ReservaValeResponseModel) => {
                    if (reserveVoucher.header.codigo === '0') {
                        this.messageService.showSuccess(reserveVoucher.header.descripcion);
                    } else {
                        this.messageService.showError(reserveVoucher.header.descripcion);
                    }
                });
                const reserveCodeVouchers: Array<string> = response.list.filter(
                    r => r.header.codigo === '0').map(r => r.codigoReserva);
                if (reserveCodeVouchers.length > 0)
                    this.confirmVoucherConsumer(new ConsumoValesRequestModel(
                        this.datePipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss", 'GMT-4', 'es-BO'),
                        null,
                        reserveCodeVouchers));
            }
        });
    }

    // #endregion ABM_SERVICE

    // #region EVENT

    public onClickConfirmVoucherConsumer(): void {
        this.confirmationService.confirm({
            header: this.translateService.instant('voucher_consumer_title'),
            message: this.translateService.instant('voucher_consumer_confirm_consumer'),
            icon: 'pi pi-info-circle',
            accept: () => this.reserveVoucherConsumer()
        });
    }

    protected onClickRetryScanner(): void {
        this.initScannerDetection();
    }

    protected onInputHashCode(codeInput: string): void {
        this.debounceScannerInput.next(codeInput);
    }

    // #region EVENT

    // #region EXTERNAL_FUNCTION
    protected parseVoucherToVoucherCut(voucherModel: ValeModel): CorteValeModel {
        return new CorteValeModel(null,
            voucherModel.monto,
            null,
            voucherModel.corteId,
            voucherModel.ventaId,
            null
        );
    }

    public initScannerDetection(): void {
        this.isScanning = true;
        this.codeInput.nativeElement.focus();
        this.hashCodeVoucherScannedOriginal = '';
        this.voucherModel = null;
        this.preventBlur();
    }

    private preventBlur() {
        this.codeInput.nativeElement.addEventListener('blur', (event) => this.isScanning = false);
    }

    protected onChangeVoucher(event: any): void {
    }

    private isValidHash(hash: string): boolean {
        let isValid: boolean = true;
        if (hash.length < 5) {
            this.messageService.showError('Código escaneado no válido');
            isValid = false;
        }
        return isValid;
    }

    // #endregion EXTERNAL_FUNCTION
}
