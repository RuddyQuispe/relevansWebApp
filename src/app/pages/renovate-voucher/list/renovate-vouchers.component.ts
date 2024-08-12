import {Component, OnInit} from '@angular/core';
import {ValeModel} from '@models/vale';
import {ITEM, OPTION_ALL, STATUS_VOUCHER, T_DOMAIN_TBZ} from '@app/utils/constants';
import {Router} from '@angular/router';
import {encryptParam} from '@app/utils/params.security.utils';
import {DomainService} from "@services/template/domain.service";
import {DomainModel, DomainModelRequestSingle, DomainModelResponseList} from "@models/domain";
import {RequestHeaderModel} from "@models/requestHeader.model";
import {AuthService} from "@services/auth.service";
import {SelectItem} from "primeng/api";

@Component({
    selector: 'app-list',
    templateUrl: './renovate-vouchers.component.html',
    styleUrls: ['./renovate-vouchers.component.scss']
})
export class RenovateVouchersComponent implements OnInit {

    public voucherToView: ValeModel;
    public displayDialog: boolean;
    protected currentTypesOptions: Array<SelectItem> = [{label: OPTION_ALL, value: ''}];

    constructor(private router: Router,
                private domainService: DomainService,
                private authService: AuthService) {
    }

    public ngOnInit(): void {
        this.voucherToView = null;
        this.displayDialog = false;
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
                })));
            }
        });
    }

    // #endregion ABM_SERVICES

    // #region EVENT

    public onClickEditVoucher = (voucherModal: ValeModel): void =>
        this.openModal(voucherModal, ITEM.EDITABLE)


    public onClickViewVoucher = (voucherModel: ValeModel): void => {
        this.voucherToView = ValeModel.clone(voucherModel);
        this.displayDialog = true;
    }

    // #region EVENT
    // #region EXTERNAL_FUNCTION

    private openModal(voucherModal: ValeModel, isNotEditable: boolean): void {
        const dataEncrypt: string = encryptParam(JSON.stringify({
            isView: isNotEditable,
            id: voucherModal.valeId
        }));
        this.router.navigate(['/vouchers/renovate', dataEncrypt]);
    }

    public onClickCloseDialog(): void {
        this.displayDialog = false;
    }

    // #endregion EXTERNAL_FUNCTION
    protected readonly STATUS_VOUCHER = STATUS_VOUCHER;
    protected readonly OPTION_ALL = OPTION_ALL;
    protected readonly length = length;

    isEnabled() {
        return this.currentTypesOptions.filter(c => c.label != OPTION_ALL).length > 0;
    }
}
