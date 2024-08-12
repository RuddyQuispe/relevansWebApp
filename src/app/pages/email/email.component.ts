import {Component, OnInit} from '@angular/core';
import {EmailService} from '@services/template/email.service';
import {AuthService} from '@services/auth.service';
import {MensajeService} from '@app/error/mensaje.service';
import {EmailModel, EmailModelRequestSingle, EmailModelResponseList, EmailModelResponseSingle} from '@app/model/email';
import {TranslateService} from '@ngx-translate/core';
import {RequestHeaderModel} from '@app/model/requestHeader.model';
import {CONFIG} from '@config/config';
import {Observable} from 'rxjs';
import {UserModel, UserModelRequestSingle, UserModelResponseSingle} from "@models/user";


@Component({
    selector: 'app-email',
    templateUrl: './email.component.html'
})
export class EmailComponent implements OnInit {

    cmpMin: string;
    cmpReq: string;
    rowsTables: number = Number(CONFIG.ROWS_TABLE);
    list: EmailModel[] = [];
    entity: EmailModel;
    entitySelect: EmailModel;
    displayDialog: boolean;
    isView: boolean;
    submitted = false;
    loading = false;

    constructor(
        private emailService: EmailService,
        private authService: AuthService,
        private translate: TranslateService,
        private mensajeService: MensajeService
    ) {
    }

    ngOnInit() {
        this.cmpReq = this.translate.instant('cmpReq');
        this.cmpMin = this.translate.instant('cmpMin');

        this.onList();
    }

    private onList() {
        this.loading = true;
        this.list = [];
        const header = new RequestHeaderModel(this.authService.getUser());
        const emailDto = new EmailModel();
        const emailRequest = new EmailModelRequestSingle(header, emailDto);
        this.emailService.list(emailRequest).subscribe({
            next: (data: EmailModelResponseList) => {
                this.loading = false;
                this.list = data.emails;
            },
            error: error => {
                this.loading = false;
            }
        });
    }

    showDialogToAdd() {
        this.isView = false;
        this.entity = new EmailModel();
        this.displayDialog = true;
    }

    showDialogToEdit(event: Event, enty: EmailModel) {
        this.isView = false;
        this.find(enty);
        this.displayDialog = true;
        event.preventDefault();
    }

    showDialogToView(event: Event, enty: EmailModel) {
        this.isView = true;
        this.find(enty);
        this.displayDialog = true;
        event.preventDefault();
    }

    onSubmit() {
        this.save(new EmailModel().clone(this.entity));
    }

    private find(emailModel: EmailModel) {
        this.submitted = true;
        this.entity = null;
        const emailRequestModel: EmailModelRequestSingle = new EmailModelRequestSingle(
            new RequestHeaderModel(this.authService.getUser()), emailModel);
        this.emailService.find(emailRequestModel).subscribe({
            next: (data: EmailModelResponseSingle) => {
                this.entity = data.email;
                this.submitted = false;
                this.displayDialog = true;
            },
            error: error => this.submitted = false
        });
    }

    save(email: EmailModel) {
        this.submitted = true;
        const header = new RequestHeaderModel(this.authService.getUser());
        email.lastTime = new Date();
        email.lastUser = header.user;
        const emailRequest = new EmailModelRequestSingle(header, email);
        let emailObservableResult: Observable<EmailModelResponseSingle>;
        if (email.emailId != undefined && email.emailId > 0) {
            emailObservableResult = this.emailService.merge(emailRequest);
        } else {
            emailObservableResult = this.emailService.save(emailRequest);
        }
        emailObservableResult.subscribe({
            next: (data: EmailModelResponseSingle) => {
                this.submitted = false;
                this.mensajeService.showSuccess(this.translate.instant('succes'));
                this.displayDialog = false;
                this.entity = null;
                this.onList();
            },
            error: error => {
                this.submitted = false;
            }
        });
    }

    close() {
        this.displayDialog = false;
        this.submitted = false;
    }
}