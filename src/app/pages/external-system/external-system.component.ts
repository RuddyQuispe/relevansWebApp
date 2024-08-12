import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DIRECTION_ORDER_BY} from '@app/utils/constants';
import {SistemaExternoFilterModel, SistemaExternoModel} from '@models/sistema-externo';
import {SistemaExternoService} from '@services/admin/sistema-externo.service';
import {ResponseFilterModel} from '@models/response.filter.model';
import {MensajeService} from '@app/error/mensaje.service';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {Observable} from 'rxjs';
import {AuthService} from '@services/auth.service';
import {UserModel, UserModelRequestSingle, UserModelResponseSingle} from '@models/user';
import {UserService} from '@services/template/user.service';
import {RequestHeaderModel} from '@models/requestHeader.model';
import {CONFIG} from '@config/config';

@Component({
    selector: 'app-external-system',
    templateUrl: './external-system.component.html',
    styleUrls: ['./external-system.component.scss']
})
export class ExternalSystemComponent implements AfterViewInit {
    protected externalSystems: ResponseFilterModel<SistemaExternoModel>;
    protected externalSystemSelected: SistemaExternoModel;

    protected rowsTables: number = Number(CONFIG.ROWS_TABLE);
    protected loading: boolean;
    protected isView: boolean;
    protected displayDialogAddAccess: boolean;
    protected submittedAddAccess: boolean;
    protected displayDialogAddAccount: boolean;
    protected sizeRecordsTable: number;
    protected externalSystemFilter: SistemaExternoFilterModel;
    protected keyDialogConfirm: string;

    constructor(private externalSystemService: SistemaExternoService,
                private userService: UserService,
                private authService: AuthService,
                private messageService: MensajeService,
                private translateService: TranslateService,
                private confirmationService: ConfirmationService,
                private changeDetectorRef: ChangeDetectorRef) {
        this.loading = false;
        this.isView = false;
        this.sizeRecordsTable = 0;
        this.displayDialogAddAccess = false;
        this.submittedAddAccess = false;
        this.keyDialogConfirm = '';
        this.initFilterPageTable();
        this.externalSystems = new ResponseFilterModel();
    }

    public ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges();
    }

    // #region ABM_SERVICES
    private loadExternalSystems() {
        this.loading = true;
        this.externalSystemService.onListByFilter(this.externalSystemFilter).subscribe({
            next: (response: ResponseFilterModel<SistemaExternoModel>) => {
                this.externalSystems = response;
                this.sizeRecordsTable = response.totalElementos;
                this.loading = false;
            }
        });
    }

    private findAccess(externalSystemModel: SistemaExternoModel): void {
        this.externalSystemService.onFindById(externalSystemModel.sistemaExternoId).subscribe({
            next: (response: SistemaExternoModel) => {
                this.externalSystemSelected = response;
            }
        });
    }

    private saveChangesExternalSystem(): void {
        this.externalSystemSelected.lastUser = this.authService.getUser();
        this.externalSystemSelected.lastTime = new Date().toISOString();
        const externalSystemClone: SistemaExternoModel = SistemaExternoModel.clone(this.externalSystemSelected);
        const responseObserverExternalSystemService: Observable<SistemaExternoModel> = this.externalSystemSelected.sistemaExternoId ?
            this.externalSystemService.onMerge(externalSystemClone) :
            this.externalSystemService.onSave(externalSystemClone);
        responseObserverExternalSystemService.subscribe({
            next: (response: SistemaExternoModel) => {
                this.messageService.showSuccess(this.translateService.instant('succes'));
                this.externalSystemSelected = new SistemaExternoModel();
                this.isView = false;
                this.displayDialogAddAccess = false;
                this.loadExternalSystems();
            }
        });
    }

    private addNueUserAccountOfExternalSystem(): void {
        this.externalSystemService.onSaveNewUserAccountExternalSystem(this.externalSystemSelected).subscribe({
            next: (response: SistemaExternoModel) => {
                this.messageService.showSuccess(this.translateService.instant('succes'));
                this.findAccess(this.externalSystemSelected);
            }
        });
    }

    private updateUserAccountExternalSystem(userModel: UserModel, status: boolean) {
        userModel.inactive = status;
        userModel.lastUser = this.authService.getUser();
        userModel.lastTime = new Date();
        // TODO: SOLUCIONAR PARCHE EN UTILS
        userModel.lastLoginDate = new Date();
        const userModelRequest: UserModelRequestSingle = new UserModelRequestSingle(
            new RequestHeaderModel(this.authService.getUser()),
            new UserModel().clone(userModel));
        this.userService.merge(userModelRequest).subscribe({
            next: (response: UserModelResponseSingle) => {
                this.messageService.showSuccess(this.translateService.instant('succes'));
                this.findAccess(this.externalSystemSelected);
            }
        });
    }

    // #endregion ABM_SERVICES
    // #region EVENTS

    protected onClickShowDialogToAdd(): void {
        this.isView = false;
        this.externalSystemSelected = new SistemaExternoModel();
        this.displayDialogAddAccess = true;
    }

    protected onClickShowDialogToEdit(event: MouseEvent, externalSystem: SistemaExternoModel): void {
        this.displayDialogAddAccess = true;
        this.isView = false;
        this.findAccess(SistemaExternoModel.clone(externalSystem));
        event.preventDefault();
    }

    protected onClickShowDialogToView(event: MouseEvent, externalSystem: SistemaExternoModel): void {
        this.displayDialogAddAccess = true;
        this.isView = true;
        this.findAccess(SistemaExternoModel.clone(externalSystem));
        event.preventDefault();
    }

    protected onClickShowDialogToAddAccount(event: MouseEvent, externalSystem: SistemaExternoModel): void {
        this.displayDialogAddAccount = true;
        this.findAccess(SistemaExternoModel.clone(externalSystem));
        event.preventDefault();
    }

    protected onSubmitToAddExternalSystem(): void {
        this.confirmationService.confirm({
            message: this.translateService.instant(this.externalSystemSelected.sistemaExternoId ? 'external_system_confirm_update_message' : 'external_system_confirm_save_message'),
            header: this.translateService.instant('external_system_title'),
            icon: 'pi pi-times-circle',
            accept: () => this.saveChangesExternalSystem()
        });
    }

    protected onClickCloseDialogAddExternalSystem(): void {
        this.displayDialogAddAccess = false;
        this.submittedAddAccess = false;
        this.externalSystemSelected = new SistemaExternoModel();
    }

    protected onClickCloseDialogAddUserAccount(): void {
        this.displayDialogAddAccount = true;
        this.externalSystemSelected = new SistemaExternoModel();
    }

    protected onSubmitToAddUserAccount(): void {
        this.confirmationService.confirm({
            message: this.translateService.instant('external_system_confirm_add_user_account_ext_sys'),
            header: this.translateService.instant('external_system_title'),
            icon: 'pi pi-times-circle',
            accept: () => this.addNueUserAccountOfExternalSystem()
        });
    }

    protected onClickChangeStatusUserAccountExternalSystem(event: MouseEvent, userModel: UserModel, isEnabled: boolean): void {
        this.confirmationService.confirm({
            message: this.translateService.instant(isEnabled ? 'external_system_confirm_enable_user_account_ext_sys' : 'external_system_confirm_disable_user_account_ext_sys'),
            header: this.translateService.instant('external_system_title'),
            icon: 'pi pi-times-circle',
            accept: () => this.updateUserAccountExternalSystem(userModel, isEnabled)
        });
    }

    public onChangePageTableAccess(event: any): void {
        this.externalSystemFilter.page = event.first / this.rowsTables;
        this.externalSystemFilter.direction = event.sortOrder > 0 ? DIRECTION_ORDER_BY.ASC : DIRECTION_ORDER_BY.DESC;
        this.externalSystemFilter.orderBy = event.sortField || SistemaExternoModel.SISTEMA_EXTERNO_ID;
        this.externalSystemFilter.codigo = event.globalFilter;
        console.log('CHANGE PAGE:', this.externalSystemFilter);
        this.loadExternalSystems();
    }

    // #endregion EVENTS

    // #region EXTERNAL_FUNCTIONS
    private initFilterPageTable() {
        this.externalSystemFilter = new SistemaExternoFilterModel(
            undefined,
            SistemaExternoModel.SISTEMA_EXTERNO_ID,
            DIRECTION_ORDER_BY.ASC,
            0,
            this.rowsTables
        );
    }

    // #endregion EXTERNAL_FUNCTIONS
}
