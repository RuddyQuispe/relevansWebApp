import {Component, OnInit} from '@angular/core';
import {ValeModel} from '@models/vale';
import {MensajeService} from '@app/error/mensaje.service';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, SelectItem} from 'primeng/api';
import {ValeService} from '@services/vouchers/vale.service';
import {OPTION_ALL, STATUS_VOUCHER, T_DOMAIN_TBZ} from "@app/utils/constants";
import {DomainModel, DomainModelRequestSingle, DomainModelResponseList} from "@models/domain";
import {RequestHeaderModel} from "@models/requestHeader.model";
import {DomainService} from "@services/template/domain.service";
import {AuthService} from "@services/auth.service";

@Component({
    selector: 'app-punishment-voucher',
    templateUrl: './punishment-vouchers.component.html',
    styleUrls: ['./punishment-vouchers.component.scss']
})
export class PunishmentVouchersComponent implements OnInit {

    public voucherModelToPunish: ValeModel;

    public currentTypesOptions: Array<SelectItem> = [{label: OPTION_ALL, value: ''}];
    public displayDialog: boolean;
    public loading: boolean;

    protected readonly STATUS_VOUCHER = STATUS_VOUCHER;

    constructor(private voucherService: ValeService,
                private domainService: DomainService,
                private authService: AuthService,
                private messageService: MensajeService,
                private translateService: TranslateService,
                private confirmationService: ConfirmationService) {
    }

    public ngOnInit(): void {
        this.displayDialog = false;
        this.loading = false;
        this.loadCurrentTypesOptions();
    }

    // #region ABM_SERVICE

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

    private punishVoucher(valeModel: ValeModel): void {
        this.loading = true;
        this.voucherService.onPunishmentVoucher(valeModel).subscribe({
            next: (response: ValeModel) => {
                this.loading = false;
                this.messageService.showSuccess(this.translateService.instant('succes'))
            }
        });
    }

    private punishVouchersMultiple(vouchers: Array<ValeModel>) {
        this.loading = true;
        this.voucherService.onPunishmentVoucherMultiple(vouchers.map(v => v.valeId)).subscribe({
            next: (response: Array<string>) => {
                if (response.length === 0)
                    this.messageService.showSuccess(this.translateService.instant('succes'));
                response.forEach(msg => this.messageService.showError(msg));
                this.loading = false;
            }
        });
    }

    // #endregion ABM_SERVICE

    // #region EVENTS
    public onClickPunishVoucher(valeModel: ValeModel): void {
        this.confirmationService.confirm({
            message: this.translateService.instant('voucher_punishment_dialog_punish'),
            header: this.translateService.instant('voucher_punishment_dialog_punish_header'),
            icon: 'pi pi-times-circle',
            accept: () => this.punishVoucher(valeModel)
        });
    }

    public onClickViewVoucher(valeModel: ValeModel): void {
        this.voucherModelToPunish = ValeModel.clone(valeModel);
        this.displayDialog = true;

    }

    public onClickCloseDialogDetail(): void {
        this.displayDialog = false;
    }

    public onClickPunishVouchersSelected(vouchers: Array<ValeModel>): void {
        this.confirmationService.confirm({
            header: this.translateService.instant('voucher_punishment_dialog_punish_multiple_header'),
            message: this.translateService.instant('voucher_punishment_dialog_punish_multiple'),
            icon: 'pi pi-times-circle',
            accept: () => this.punishVouchersMultiple(vouchers)
        });
    }

    isEnabled() {
        return this.currentTypesOptions.filter(c => c.label != OPTION_ALL).length > 0;
    }
    // #endregion EVENTS
}