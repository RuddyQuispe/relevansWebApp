import {Component, OnInit} from '@angular/core';
import {DomainService} from '@services/template/domain.service';
import {MensajeService} from '@app/error/mensaje.service';
import {AuthService} from '@services/auth.service';
import {
    DomainModel,
    DomainModelRequestSingle,
    DomainModelResponseList,
    DomainModelResponseSingle
} from '@app/model/domain';
import {RequestHeaderModel} from '@app/model/requestHeader.model';
import {TranslateService} from '@ngx-translate/core';
import {CONFIG} from '@config/config';
import {ConfirmationService} from "primeng/api";
import {DatePipe} from "@angular/common";

@Component({
    selector: "app-domain",
    templateUrl: './domain.component.html',
})
export class DomainComponent implements OnInit {
    protected rowsTables: number = Number(CONFIG.ROWS_TABLE);
    protected domains: Array<DomainModel> = [];
    protected domainToEdit: DomainModel;
    protected encryptConfirm: string;
    protected displayDialog: boolean;
    protected isView: boolean;
    protected loading: boolean = false;

    constructor(public domainService: DomainService,
                private authService: AuthService,
                private confirmationService: ConfirmationService,
                private translate: TranslateService,
                private messageService: MensajeService,
                private datePipe: DatePipe) {
    }

    public ngOnInit(): void {
        this.onList();
    }

    onList() {
        this.loading = true;
        const header = new RequestHeaderModel(this.authService.getUser());
        const domainRequest = new DomainModelRequestSingle(header,
            new DomainModel());
        this.domainService.onList(domainRequest).subscribe({
            next: (response: DomainModelResponseList) => {
                this.loading = false;
                this.domains = response.domains;
            },
            error: (error) => {
                this.loading = false;
            }
        });
    }

    showEdit(event: Event, domain: DomainModel) {
        this.domainToEdit = new DomainModel(
            domain.domainTbz,
            null,
            domain.domName,
            domain.domValue,
            domain.description,
            domain.encrypted,
            domain.lastUser,
            domain.lastTime
        );
        this.domainToEdit.domainId = domain.domainId;
        this.displayDialog = true;
        this.isView = false;
        this.encryptConfirm = null;
        this.encryptConfirm = this.domainToEdit.domValue;
        event.preventDefault();
    }

    showView(event: Event, domain: DomainModel) {
        this.domainToEdit = new DomainModel(
            domain.domainTbz,
            null,
            domain.domName,
            domain.domValue,
            domain.description,
            domain.encrypted,
            domain.lastUser,
            domain.lastTime
        );
        this.displayDialog = true;
        this.isView = true;
        this.encryptConfirm = this.domainToEdit.domValue;
        event.preventDefault();
    }

    protected mergeDomain(): void {
        const header = new RequestHeaderModel(this.authService.getUser());
        this.domainToEdit.lastUser = this.authService.getUser();
        this.domainToEdit.lastTime = this.datePipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss", 'GMT-4', 'es-BO');
        const domainRequest = new DomainModelRequestSingle(header, DomainModel.clone(this.domainToEdit));
        this.domainService.onMerge(domainRequest).subscribe({
            next: (response: DomainModelResponseSingle) => {
                this.displayDialog = false;
                this.messageService.showSuccess(this.translate.instant('succes'));
                this.onList();
            },
            error: (error) => {
            }
        });
    }

    protected saveDomain(): void {
        const header = new RequestHeaderModel(this.authService.getUser());
        this.domainToEdit.lastTime = this.datePipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss", 'GMT-4', 'es-BO');
        this.domainToEdit.lastUser = this.authService.getUser();
        const domainRequest = new DomainModelRequestSingle(header, DomainModel.clone(this.domainToEdit));
        this.domainService.onSave(domainRequest).subscribe({
            next: (response: DomainModelResponseSingle) => {
                this.displayDialog = false;
                this.messageService.showSuccess(this.translate.instant('succes'));
                this.onList();
            },
            error: (error) => {
            }
        });
    }

    protected showAdd(): void {
        this.domainToEdit = new DomainModel();
        this.domainToEdit.encrypted = false;
        this.displayDialog = true;
        this.isView = false;
        this.encryptConfirm = null;
        this.encryptConfirm = this.domainToEdit.domValue;
    }

    protected onSubmit(): void {
        debugger;
        if (this.domainToEdit.encrypted && this.domainToEdit.domValue !== this.encryptConfirm) {
            const message: string = this.translate.instant('value_error');
            this.messageService.showWarning(message);
            return;
        }
        const isNewDomain: boolean = !this.domainToEdit.domainId;
        this.confirmationService.confirm({
            header: this.translate.instant(isNewDomain ? 'domain_title_confirm_save' : 'domain_title_confirm_update'),
            message: this.translate.instant(isNewDomain ? 'domain_title_confirm_save_message' : 'domain_title_confirm_update_message'),
            accept: () => isNewDomain ? this.saveDomain() : this.mergeDomain(),
        })
    }
}
