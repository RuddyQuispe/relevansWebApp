import * as $ from 'jquery';
import {Component, OnInit} from '@angular/core';
import {ValeFraccionadoModel, ValeFraccionamientoRequestModel, ValeModel} from '@models/vale';
import {parseDateStringToDate} from '@app/utils/helpers';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {decryptParam} from '@app/utils/params.security.utils';
import {ValeService} from '@services/vouchers/vale.service';
import {CONFIG} from '@config/config';
import {TranslateService} from '@ngx-translate/core';
import {MensajeService} from '@app/error/mensaje.service';
import {ConfirmationService, SelectItem} from 'primeng/api';
import {ArchivoModel} from '@models/archivo.model';
import {DomainModel, DomainModelRequestSingle, DomainModelResponseList} from "@models/domain";
import {RequestHeaderModel} from "@models/requestHeader.model";
import {T_DOMAIN_TBZ} from "@app/utils/constants";
import {DomainService} from "@services/template/domain.service";
import {AuthService} from "@services/auth.service";

@Component({
    selector: 'app-division-voucher',
    templateUrl: './division-voucher.component.html',
    styleUrls: ['./division-voucher.component.scss']
})
export class DivisionVoucherComponent {

    public voucherModelEdit: ValeModel;
    public vouchersDivide: Array<ValeFraccionadoModel>;
    public newVoucherDivide: ValeFraccionadoModel;

    protected readonly parseDateStringToDate = parseDateStringToDate;
    protected currentTypesOptions: Array<SelectItem> = [];
    public isView: boolean;
    public submitted: boolean;
    public isVisibleDialogOfAddVoucher: boolean;
    public submittedVoucherAdd: boolean;
    public loading: boolean;
    public rowsTables: number = Number(CONFIG.ROWS_TABLE);
    public cmpReq: string;
    public cmpMin: string;
    public pdfName: string;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private voucherService: ValeService,
                private domainService: DomainService,
                private authService: AuthService,
                private messageService: MensajeService,
                private translateService: TranslateService,
                private confirmationService: ConfirmationService) {
        // initialize options values from translateService
        this.loadCurrentTypesOptions();
        this.vouchersDivide = [];
        this.pdfName = 'impresion_vales.pdf';
        this.newVoucherDivide = new ValeFraccionadoModel();
        this.route.params.subscribe((params: Params): void => {
            const {id, isView} = JSON.parse(decryptParam(params.data));
            this.isView = isView;
            this.voucherModelEdit = new ValeModel();
            if (id === 0) return;
            this.findVoucher(id);
        });
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

    private findVoucher(valeId: number): void {
        this.voucherService.onFindById(valeId).subscribe({
            next: (response: ValeModel) => {
                this.voucherModelEdit = response;
                this.voucherModelEdit.fechaVigenciaDate = new Date(this.voucherModelEdit.fechaVigencia);
                this.voucherModelEdit.fechaEmisionDate = new Date(this.voucherModelEdit.fechaEmision);
            }
        });
    }

    private saveVoucherDivided(): void {
        this.voucherService.onDivideVoucher(
            new ValeFraccionamientoRequestModel(this.voucherModelEdit.valeId, this.vouchersDivide)).subscribe({
            next: (response: Array<ValeModel>) => {
                this.messageService.showSuccess(this.translateService.instant('succes'));
                this.onClickPrintVouchersDivided(response);
            }
        });
    }

    private printVouchersSelected(vouchersDivided: Array<ValeModel>): void {
        this.voucherService.onPrintVouchers(vouchersDivided).subscribe({
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

    // #region ABM_SERVICES

    // #region EVENTS

    public onSubmitToDivideVoucher(): void {
        this.confirmationService.confirm({
            header: this.translateService.instant('voucher_fractionation_confirm_dialog_save_header'),
            message: this.translateService.instant('voucher_fractionation_confirm_dialog_save_body'),
            icon: 'pi pi-times-circle',
            accept: () => this.saveVoucherDivided()
        });
    }

    public onClickBack(): void {
        this.router.navigate(['/vouchers/division']);
    }

    public onClickOpenDialogAddVoucherCut(): void {
        this.newVoucherDivide = new ValeFraccionadoModel('', null);
        this.isVisibleDialogOfAddVoucher = true;
    }

    public onClickRemoveVoucherCut(cortevaleModel: ValeFraccionadoModel, index: number): void {
        if (this.isView) return;
        this.vouchersDivide.splice(index, 1);
    }

    public onClickAddVoucherCut(): void {
        this.vouchersDivide.push(this.newVoucherDivide);
        this.isVisibleDialogOfAddVoucher = false;
    }

    public onClickCloseDialogAddVoucherCut(): void {
        this.isVisibleDialogOfAddVoucher = false;
    }

    private onClickPrintVouchersDivided(vouchersDivided: Array<ValeModel>): void {
        this.confirmationService.confirm({
            header: this.translateService.instant('voucher_fractionation_confirm_dialog_print_header'),
            message: this.translateService.instant('voucher_fractionation_confirm_dialog_print_body'),
            icon: 'pi pi-times-circle',
            accept: () => this.printVouchersSelected(vouchersDivided),
            reject: () => setTimeout(() => this.router.navigate(['/vouchers/division']), 1000)
        });
    }


    // #endregion EVENTS

    // #region EXTERNAL_FUNCTIONS

    public getSumTotalVoucherCuts(): number {
        return this.vouchersDivide.reduce((total: number, voucherDivided: ValeFraccionadoModel) =>
            total + Number(voucherDivided.importe.toFixed(2)), 0);
    }

    // #endregion EXTERNAL_FUNCTIONS
}
