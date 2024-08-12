import {Component, OnInit} from '@angular/core';
import {ValeModel} from '@models/vale';
import {Router} from '@angular/router';
import {ITEM, OPTION_ALL, STATUS_VOUCHER, T_DOMAIN_TBZ} from '@app/utils/constants';
import {encryptParam} from '@app/utils/params.security.utils';
import {DomainModel, DomainModelRequestSingle, DomainModelResponseList} from "@models/domain";
import {RequestHeaderModel} from "@models/requestHeader.model";
import {DomainService} from "@services/template/domain.service";
import {AuthService} from "@services/auth.service";
import {SelectItem} from "primeng/api";

@Component({
    selector: 'app-division-vouchers',
    templateUrl: './division-vouchers.component.html',
    styleUrls: ['./division-vouchers.component.scss']
})
export class DivisionVouchersComponent implements OnInit {

    public voucherToView: ValeModel;
    public currentTypesOptions: Array<SelectItem> = [{label: OPTION_ALL, value: ''}];
    public displayDialog: boolean;
    protected readonly STATUS_VOUCHER = STATUS_VOUCHER;

    constructor(private router: Router,
                private domainService: DomainService,
                private authService: AuthService) {
    }

    public ngOnInit(): void {
        this.displayDialog = false;
        this.voucherToView = null;
        this.loadCurrentTypesOptions();
    }

    // #region ABM_SERVICES

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

    // #endregion ABM_SERVICES
    // #region EVENTS

    public onClickEditVoucher = (voucherModel: ValeModel): void =>
        this.openModal(voucherModel, ITEM.EDITABLE)

    public onClickViewVoucher = (voucherModel: ValeModel): void => {
        this.voucherToView = ValeModel.clone(voucherModel);
        this.displayDialog = true;
    }

    // #endregion EVENTS
    // #region EXTERNAL_FUNCTION

    private openModal(voucherModal: ValeModel, isNotEditable: boolean): void {
        const dataEncrypt: string = encryptParam(JSON.stringify({
            isView: isNotEditable,
            id: voucherModal.valeId
        }));
        this.router.navigate(['/vouchers/division', dataEncrypt]);
    }

    public onClickCloseDialog(): void {
        this.displayDialog = false;
    }

    isEnabled() {
        return this.currentTypesOptions.filter(c => c.label != OPTION_ALL).length > 0;
    }
    // #endregion EXTERNAL_FUNCTION
}
