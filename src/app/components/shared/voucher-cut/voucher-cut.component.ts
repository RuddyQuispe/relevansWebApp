import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CorteValeModel} from '@models/corte-vale/corte.vale.model';
import {ValeModel} from '@models/vale';
import {ValeService} from '@services/vouchers/vale.service';
import {ArchivoModel} from '@models/archivo.model';

@Component({
    selector: 'shared-voucher-cut',
    templateUrl: './voucher-cut.component.html',
    styleUrls: ['./voucher-cut.component.scss']
})
export class VoucherCutComponent implements OnInit, AfterViewInit {

    @Input() public voucherModel: ValeModel;
    @Input() public voucherCutModel: CorteValeModel;
    @Input() public typeCurrent: string;
    @Input() public showCounterPrinterComponents: boolean = true;
    @Output() public eventEmitterChangeVoucherCut: EventEmitter<{
        corteValeId: number,
        ventaId: number,
        cantidad?: number
    }>;
    public currentCountVoucherCuts: number;
    public checkToPrint: boolean;
    public loading: boolean;
    public imageVoucher: string;

    constructor(private changeDetector: ChangeDetectorRef,
                private voucherService: ValeService) {
        this.checkToPrint = false;
        this.eventEmitterChangeVoucherCut = new EventEmitter<{
            corteValeId: number;
            ventaId: number;
            cantidad: number
        }>();
        this.voucherCutModel = new CorteValeModel();
        this.voucherModel = new ValeModel();
        this.currentCountVoucherCuts = 0;
        this.loading = false;
        this.imageVoucher = 'assets/images/loading-image.gif';
    }

    public ngAfterViewInit(): void {
        this.changeDetector.detectChanges();
    }


    public ngOnInit(): void {
        this.loadImageVoucher();
    }

    public onCheckToPrintVoucher(): void {
        this.currentCountVoucherCuts = 0;
        this.eventEmitterChangeVoucherCut.emit({
            corteValeId: this.voucherCutModel.ventaCorteId,
            ventaId: this.voucherModel.ventaId,
            cantidad: this.checkToPrint ? 0 : null
        });
    }

    public onChangeCountCuts(): void {
        this.eventEmitterChangeVoucherCut.emit({
            corteValeId: this.voucherCutModel.ventaCorteId,
            ventaId: this.voucherModel.ventaId,
            cantidad: this.currentCountVoucherCuts
        });
    }

    private loadImageVoucher(): void {
        this.loading = true;
        this.voucherService.onGenerateImagen64(this.voucherModel).subscribe({
            next: (response: ArchivoModel) => {
                this.imageVoucher = 'data:image/png;base64,' +
                    response.base64.replace(/^data:application\/[^;]+/, 'data:application/octet-stream');
                this.loading = false;
            },
            error: err => this.loading = false
        });
    }
}
