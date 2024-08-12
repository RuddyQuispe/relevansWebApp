import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {parseDateStringToDate} from '@app/utils/helpers';
import {ConsumerFilterModel, ConsumoValeModel} from '@models/vale';
import {ResponseFilterModel} from '@models/response.filter.model';
import {DIRECTION_ORDER_BY, OPTION_ALL, T_DOMAIN_TBZ} from '@app/utils/constants';
import {CONFIG} from '@config/config';
import {ConsumoService} from "@services/vouchers/consumo.service";
import {DomainModel, DomainModelRequestSingle, DomainModelResponseList} from "@models/domain";
import {RequestHeaderModel} from "@models/requestHeader.model";
import {DomainService} from "@services/template/domain.service";
import {AuthService} from "@services/auth.service";
import {SelectItem} from "primeng/api";

@Component({
    selector: 'app-voucher-consumer-report',
    templateUrl: './voucher-consumer-report.component.html',
    styleUrls: ['./voucher-consumer-report.component.scss']
})
export class VoucherConsumerReportComponent implements OnInit, AfterViewInit {

    protected filterConsumerVoucher: ConsumerFilterModel;
    protected reportConsumerVoucherReport: ResponseFilterModel<ConsumoValeModel>;
    public rowsTables: number = Number(CONFIG.ROWS_TABLE);
    protected loading: boolean;
    protected sizeConsumers: number;
    public currentTypesOptions: Array<SelectItem> = [{label: OPTION_ALL, value: ''}];

    constructor(private consumerVoucherService: ConsumoService,
                private domainService: DomainService,
                private authService: AuthService,
                private detectorChangesRefService: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        this.sizeConsumers = 0;
        this.reportConsumerVoucherReport = new ResponseFilterModel();
        this.initializeFilter();
        this.loadCurrentTypesOptions();
    }

    public ngAfterViewInit(): void {
        this.detectorChangesRefService.detectChanges();
    }

    // #region ABM_SERVICES

    private loadCurrentTypesOptions(): void {
        this.domainService.onList(new DomainModelRequestSingle(new RequestHeaderModel(this.authService.getUser()),
            new DomainModel(T_DOMAIN_TBZ.CURRENT_TYPE))).subscribe({
            next: (response: DomainModelResponseList) => {
                this.currentTypesOptions = response.domains.map((d: DomainModel) => {
                    return {label: d.domName, value: d.domValue, title: d.description};
                }).sort(((d, dc) => {
                    if (d.label < dc.label) return -1;
                    if (d.label > dc.label) return 1;
                    return 0;
                }));
            }
        });
    }

    private loadConsumerReport(): void {
        this.loading = true;
        this.filterConsumerVoucher.fechaInicio = this.filterConsumerVoucher._fechaInicioDate.toISOString().slice(0, 10);
        this.filterConsumerVoucher.fechaFin = this.filterConsumerVoucher._fechaFinDate.toISOString().slice(0, 10);
        this.consumerVoucherService.onListConsumerVoucherReportByFilter(ConsumerFilterModel.clone(this.filterConsumerVoucher)).subscribe({
            next: (response: ResponseFilterModel<ConsumoValeModel>) => {
                this.reportConsumerVoucherReport = response;
                this.reportConsumerVoucherReport.contenido.forEach(c =>
                    c.fecha = parseDateStringToDate(c.fecha.toString()));
                this.sizeConsumers = response.totalElementos;
                this.loading = false;
            },
            error: err => this.loading = false
        });
    }

    // #endregion ABM_SERVICES

    // #region EVENTS
    protected onSubmitFilterVouchers(): void {
        this.filterConsumerVoucher.page = 0;
        this.loadConsumerReport();
    }

    protected onClickClearFilterVouchers(): void {
        this.initializeFilter();
    }

    protected onChangePageTable(event: any) {
        this.filterConsumerVoucher.page = (event.first / this.rowsTables);
        this.filterConsumerVoucher.direction = !event.sortField ? DIRECTION_ORDER_BY.DESC : (event.sortOrder > 0 ? DIRECTION_ORDER_BY.ASC : DIRECTION_ORDER_BY.DESC);
        this.filterConsumerVoucher.orderBy = event.sortField || 'consumoId';
        this.loadConsumerReport();
    }

    // #endregion EVENTS

    // #region EXTERNAL_FUNCTIONS
    private initializeFilter(): void {
        this.filterConsumerVoucher = new ConsumerFilterModel(
            'consumoId',
            DIRECTION_ORDER_BY.DESC,
            0,
            this.rowsTables,
            null,
            null,
            null,
            null,
            new Date().toString(),
            new Date().toString(),
        );
    }

    // #endregion EXTERNAL_FUNCTIONS
}
