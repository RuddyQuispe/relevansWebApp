import {Component, OnInit} from '@angular/core';
import {ValeModel} from '@models/vale';
import {parseDateStringToDate} from '@app/utils/helpers';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {decryptParam} from '@app/utils/params.security.utils';
import {ValeService} from '@services/vouchers/vale.service';
import {MensajeService} from '@app/error/mensaje.service';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, SelectItem} from 'primeng/api';
import {DomainModel, DomainModelRequestSingle, DomainModelResponseList} from "@models/domain";
import {RequestHeaderModel} from "@models/requestHeader.model";
import {T_DOMAIN_TBZ} from "@app/utils/constants";
import {DomainService} from "@services/template/domain.service";
import {AuthService} from "@services/auth.service";

@Component({
    selector: 'app-edit',
    templateUrl: './renovate-voucher.component.html',
    styleUrls: ['./renovate-voucher.component.scss']
})
export class RenovateVoucherComponent implements OnInit {

    public voucherModalEdit: ValeModel;

    protected readonly parseDateStringToDate = parseDateStringToDate;
    public isView: boolean;
    public submitted: boolean;
    public currentTypesOptions: Array<SelectItem> = [];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private voucherService: ValeService,
                private domainService: DomainService,
                private authService: AuthService,
                private messageService: MensajeService,
                private translateService: TranslateService,
                private confirmationService: ConfirmationService) {
        this.loadCurrentTypesOptions();
        this.route.params.subscribe((params: Params): void => {
            const {id, isView} = JSON.parse(decryptParam(params.data));
            this.isView = isView;
            this.voucherModalEdit = new ValeModel();
            if (id === 0) return;
            this.findVoucher(id);
        });

    }

    ngOnInit(): void {
    }

    // #region ABM_SERVICE

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

    private findVoucher(valeId: number) {
        this.voucherService.onFindById(valeId).subscribe({
            next: (response: ValeModel) => {
                this.voucherModalEdit = response;
                this.voucherModalEdit.fechaVigenciaDate = new Date(this.voucherModalEdit.fechaVigencia);
                this.voucherModalEdit.fechaEmisionDate = new Date(this.voucherModalEdit.fechaEmision);
            }
        });
    }

    private updateVoucherModel() {
        this.voucherModalEdit.fechaVigencia = this.voucherModalEdit.fechaVigenciaDate.toISOString().slice(0, 19);
        this.voucherModalEdit.fechaEmision = this.voucherModalEdit.fechaEmisionDate.toISOString().slice(0, 19);
        this.voucherService.onRenovateVoucher(this.voucherModalEdit).subscribe({
            next: (response: ValeModel) => {
                this.messageService.showSuccess(this.translateService.instant('succes'));
                setTimeout(() => this.router.navigate(['/vouchers/renovate']), 2000);
            }
        });
    }

    // #endregion ABM_SERVICE

    // #region EVENTS

    public onSubmitToRenovateVoucher() {
        this.confirmationService.confirm({
            header: this.translateService.instant('voucher_renovate_confirm_dialog_update_header'),
            message: this.translateService.instant('voucher_renovate_confirm_dialog_update_body'),
            icon: 'pi pi-times-circle',
            accept: () => this.updateVoucherModel()
        });
    }

    public onClickBack(): void {
        this.router.navigate(['/vouchers/renovate']);
    }

    // #region EVENTS
}
