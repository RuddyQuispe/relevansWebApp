import {Component, OnInit} from '@angular/core';
import {ValeModel} from "@models/vale";
import {OPTION_ALL, STATUS_CONSUMER_VOUCHER, STATUS_VOUCHER, T_DOMAIN_TBZ} from "@app/utils/constants";
import {ValeService} from "@services/vouchers/vale.service";
import {ConfirmationService, SelectItem} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {MensajeService} from "@app/error/mensaje.service";
import {DomainModel, DomainModelRequestSingle, DomainModelResponseList} from "@models/domain";
import {RequestHeaderModel} from "@models/requestHeader.model";
import {DomainService} from "@services/template/domain.service";
import {AuthService} from "@services/auth.service";

@Component({
    selector: 'app-list-voucher',
    templateUrl: './list-voucher.component.html',
    styleUrls: ['./list-voucher.component.scss']
})
export class ListVoucherComponent implements OnInit {

    protected displayDialogVoucher: boolean = false;
    protected voucherToView: ValeModel = new ValeModel();
    protected loading: boolean = false;
    public currentTypesOptions: Array<SelectItem> = [{label: OPTION_ALL, value: ''}];
    protected readonly OPTION_ALL: string = OPTION_ALL;

    constructor(private voucherService: ValeService,
                private domainService: DomainService,
                private authService: AuthService,
                private translateService: TranslateService,
                private messageService: MensajeService,
                private confirmationService: ConfirmationService) {
    }

    public ngOnInit(): void {
        this.loadCurrentTypesOptions();
    }

    /* #region ABM_SERVICES */

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
                })))
            }
        });
    }

    private find(vale: ValeModel): void {
        this.voucherService.onFindById(vale.valeId).subscribe({
            next: (response: ValeModel) =>
                this.voucherToView = response
        });
    }

    private redeemVoucher(): void {
        this.loading = true;
        this.voucherService.onRedeemVoucher(ValeModel.clone(this.voucherToView)).subscribe({
            next: (response: ValeModel): void => {
                this.messageService.showSuccess(this.translateService.instant('voucher_list_success_msg'))
                this.displayDialogVoucher = false;
                this.loading = false;
            },
            error: err => this.loading = false
        })
    }

    /* #endregion ABM_SERVICES */

    /* #region EVENTS */
    protected onClickViewVoucher(valeModel: ValeModel) {
        this.find(valeModel);
        this.displayDialogVoucher = true;
    }

    protected onClickCloseDialog() {
        this.voucherToView = new ValeModel();
        this.displayDialogVoucher = false;
    }

    protected onClickRedeemVoucher(): void {
        this.confirmationService.confirm({
            header: this.translateService.instant('voucher_list_confirmation_header_msg'),
            message: this.translateService.instant('voucher_list_confirmation_message_msg'),
            accept: () => this.redeemVoucher()
        });
    }

    /* #endregion EVENTS */

    /* #region EXTERNAL_FUNCTION */
    protected isVoucherContabilizado(voucherToView: ValeModel) {
        return voucherToView.consumoDto && voucherToView.consumoDto.estado == STATUS_CONSUMER_VOUCHER.CONTABILIZADO &&
            (voucherToView.estado == STATUS_VOUCHER.CONSUMIDO || voucherToView.estado == STATUS_VOUCHER.CASTIGADO)
    }

    isEnabled() {
        return this.currentTypesOptions.filter(c => c.label != OPTION_ALL).length > 0;
    }
    /* #endregion EXTERNAL_FUNCTION */
    protected readonly STATUS_VOUCHER = STATUS_VOUCHER;
}
