import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges
} from '@angular/core';
import {DIRECTION_ORDER_BY, OPTION_ALL, STATUS_VOUCHER} from '@app/utils/constants';
import {CONFIG} from '@config/config';
import {ResponseFilterModel} from '@models/response.filter.model';
import {parseDateStringToDate} from '@app/utils/helpers';
import {ValeFilterModel} from '@models/vale';
import {ValeModel} from '@models/vale/vale.model';
import {ValeService} from '@services/vouchers/vale.service';
import {MensajeService} from "@app/error/mensaje.service";
import {DatePipe} from "@angular/common";
import {SelectItem} from "primeng/api";

@Component({
    selector: 'shared-voucher-list-filter',
    templateUrl: './voucher-list-filter.component.html',
    styleUrls: ['./voucher-list-filter.component.scss']
})
export class VoucherListFilterComponent implements AfterViewInit, OnChanges, OnDestroy {

    @Input() public titleFirstAction: string;
    @Input() public classFirstAction: string;
    @Input() public iconFirstAction: string;
    @Output() public commandFirstAction: EventEmitter<ValeModel>;
    @Input() public iconsSecondAction: string;
    @Input() public titleSecondAction: string;
    @Input() public classSecondAction: string;
    @Output() public commandSecondAction: EventEmitter<ValeModel>;

    @Input() public enableSelectionMultipleVouchers: boolean = false;
    @Input() public selectionMultipleButtonTitle: string;
    @Output() public commandActionSelectionMultipleVouchers: EventEmitter<Array<ValeModel>>;
    @Input() public onlyStatusVoucher: string;
    @Input() public filterVoucher: ValeFilterModel | null;
    @Output() public filterVoucherChange: EventEmitter<ValeFilterModel>;

    public vouchersResponse: ResponseFilterModel<ValeModel>;
    public rowsTables: number = Number(CONFIG.ROWS_TABLE);
    @Input() public loading: boolean;
    public sizeVouchers: number;
    @Input() public currentTypesOptions: Array<SelectItem> = [];
    protected readonly STATUS_VOUCHER = STATUS_VOUCHER;
    protected readonly OPTION_ALL = OPTION_ALL;


    public voucherSelected: Array<ValeModel> = [];

    constructor(private voucherService: ValeService,
                private datePipe: DatePipe,
                private changeDetector: ChangeDetectorRef,
                private messageService: MensajeService,) {
        if (this.filterVoucher == null)
            this.initializeVoucherFilter();
        this.sizeVouchers = 0;
        this.onlyStatusVoucher = '';
        this.loading = false;

        this.commandFirstAction = new EventEmitter<ValeModel>();
        this.commandSecondAction = new EventEmitter<ValeModel>();

        this.vouchersResponse = new ResponseFilterModel<ValeModel>();
        this.commandActionSelectionMultipleVouchers = new EventEmitter<Array<ValeModel>>();
        this.filterVoucherChange = new EventEmitter<ValeFilterModel>();
    }

    public ngOnDestroy(): void {
        this.vouchersResponse = new ResponseFilterModel<ValeModel>();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.loading)
            return;
        this.onSubmitFilterVouchers();
    }

    public ngAfterViewInit(): void {
        this.changeDetector.detectChanges();
    }

    // #region EXTERNAL_FUNCTIONS

    private isFilterVoucherValid() {
        let isValid: boolean = true;
        if (this.filterVoucher.fechaInicioDate > this.filterVoucher.fechaFinDate) {
            this.messageService.showWarning('la fecha fin no puede ser menor a la fecha inicio del filtro')
            isValid = false;
        }
        if (this.filterVoucher.identificadorQr &&
            (this.filterVoucher.identificadorQr.toString().includes(',') ||
                this.filterVoucher.identificadorQr.toString().includes('.') ||
                this.filterVoucher.identificadorQr.toString().includes('e'))) {
            this.messageService.showWarning('identificador de vale no valido');
            isValid = false;
        }
        if (this.filterVoucher.importe && this.filterVoucher.importe.toString().includes('e')) {
            this.messageService.showWarning('importe no valido');
            isValid = false;
        }
        return isValid;
    }

    // #endregion EXTERNAL_FUNCTIONS
    // #region ABM_SERVICES

    private loadVouchers(): void {
        this.loading = true;
        // formatting date to string
        this.filterVoucher.fechaInicio = this.datePipe.transform(this.filterVoucher.fechaInicioDate, 'yyyy-MM-dd', 'GMT-4', 'es-BO');
        this.filterVoucher.fechaFin = this.datePipe.transform(this.filterVoucher.fechaFinDate, 'yyyy-MM-dd', 'GMT-4', 'es-BO');
        this.voucherService.onList(ValeFilterModel.clone(this.filterVoucher)).subscribe({
            next: (response: ResponseFilterModel<ValeModel>) => {
                this.vouchersResponse = response;
                this.sizeVouchers = this.vouchersResponse.totalElementos;
                this.loading = false;
            },
            error: err => this.loading = false
        });
    }

    // #region ABM_SERVICES
    // #region EVENTS

    public onSubmitFilterVouchers(): void {
        if (!this.isFilterVoucherValid()) return;
        this.filterVoucher.page = 0;
        if (this.onlyStatusVoucher !== OPTION_ALL)
            this.filterVoucher.estado = this.onlyStatusVoucher;

        this.loadVouchers();
    }

    public onClickClearFilterVouchers(): void {
        this.initializeVoucherFilter();
    }

    public onChangePageTable(event: any): void {
        this.filterVoucher.page = (event.first / this.rowsTables);
        this.filterVoucher.direction = !event.sortField ? DIRECTION_ORDER_BY.DESC : (event.sortOrder > 0 ? DIRECTION_ORDER_BY.ASC : DIRECTION_ORDER_BY.DESC);
        this.filterVoucher.orderBy = event.sortField || 'fechaEmision';
        if (this.onlyStatusVoucher !== OPTION_ALL)
            this.filterVoucher.estado = this.onlyStatusVoucher;
        this.loadVouchers();
    }

    public onClickFirstAction = (event: MouseEvent, voucherModel: ValeModel): void => {
        this.filterVoucherChange.emit(this.filterVoucher);
        this.commandFirstAction.emit(voucherModel)
    }

    public onClickSecondAction = (event: MouseEvent, voucherModel: ValeModel): void => {
        this.filterVoucherChange.emit(this.filterVoucher);
        this.commandSecondAction.emit(voucherModel)
    }

    public onClickActionMultipleSelectedVouchers(): void {
        if (this.enableSelectionMultipleVouchers)
            this.commandActionSelectionMultipleVouchers.emit(this.voucherSelected);
    }

    // #endregion EVENTS

    private initializeVoucherFilter() {
        this.filterVoucher = new ValeFilterModel(
            'fechaEmision',
            DIRECTION_ORDER_BY.DESC,
            0,
            this.rowsTables,
            new Date().toString(),
            new Date().toString(),
            null, null, null, null, null);
        this.filterVoucher.fechaInicioDate = new Date();
        this.filterVoucher.fechaFinDate = new Date();
    }
}
