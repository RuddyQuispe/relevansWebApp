import {Component, OnInit} from '@angular/core';
import {AuthService} from '@services/auth.service';
import {Router} from '@angular/router';
import {UserService} from '@services/template/user.service';
import {TranslateService} from '@ngx-translate/core';
import {RequestHeaderModel} from '@app/model/requestHeader.model';
import {MensajeService} from '@app/error/mensaje.service';
import {UserModel, UserModelRequestSingle, UserModelResponseSingle} from '@app/model/user';
import {ChangePasswordRequestModel, ChangePasswordResponseModel} from '@models/password';

@Component({
    selector: 'app-change',
    templateUrl: './change.component.html',
    styleUrls: ['../login/app.login.scss']
})
export class ChangeComponent implements OnInit {

    cmpMin: string;
    cmpReq: string;
    msgQr: string;
    msgQrError: string;
    username: string;
    pass: string;
    confirm: string;
    code: string;
    submit: boolean;

    constructor(public userService: UserService,
                private router: Router,
                private authService: AuthService,
                private translateService: TranslateService,
                private mensajeService: MensajeService) {
    }

    ngOnInit() {
        this.cmpMin = this.translateService.instant('cmpMin');
        this.cmpReq = this.translateService.instant('cmpReq');
        this.msgQr = this.translateService.instant('change_msgQr');
        this.msgQrError = this.translateService.instant('change_msgQrError');
    }

    onChange() {
        if (this.pass !== this.confirm) {
            this.mensajeService.showError(this.translateService.instant('change_pass_no_con'));
            return;
        }
        this.submit = true;
        this.userService.resetPassword(
            new ChangePasswordRequestModel(this.username, this.pass, this.code)).subscribe({
                next: (response: ChangePasswordResponseModel) => {
                    if (response.passwordUpdated) {
                        this.mensajeService.showSuccess(this.translateService.instant('change_update_password_success'));
                        setTimeout(() => this.router.navigate(['login']), 3000);
                        return;
                    }
                    this.mensajeService.showError(this.translateService.instant('change_update_password_error'));
                },
                error: err =>
                    this.mensajeService.showError(
                        this.translateService.instant('change_update_password_error'))
            }
        );

    }

    onSendMail() {
        if (!this.username || this.username === '') {
            this.mensajeService.showError(this.translateService.instant('change_enterUserlogin'));
            return;
        }
        this.authService.sendPasswordRequest(new ChangePasswordRequestModel(this.username, this.pass, this.code)).subscribe(
            (data: ChangePasswordResponseModel) => {
                if (data.codeSent)
                    this.mensajeService.showSuccess(this.translateService.instant('change_msg_mail_sent'));
                else
                    this.mensajeService.showError(this.translateService.instant('change_msg_mail_sent_error'));
            },
            error => this.mensajeService.showError(this.translateService.instant('change_msg_mail_sent_error'))
        );
    }

    goLogin() {
        this.router.navigate(['login']);
    }
}
