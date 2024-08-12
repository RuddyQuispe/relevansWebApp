import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {BaseModel} from '@app/model/util/base.model';
import {AuthModelRequest, AuthModelResponse} from '@app/model/auth';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {VERSION} from '../../../environments/version';
import {RequestHeaderModel} from '@app/model/requestHeader.model';
import {MensajeService} from '@app/error/mensaje.service';

@Component({
    selector: 'app-login',
    templateUrl: './app.login.component.html',
    styleUrls: ['./app.login.scss']
})
export class AppLoginComponent extends BaseModel implements OnInit, AfterViewInit {

    cmpReq: string;
    submitted = false;
    usu: string;
    pass: string;
    eyePass = false;
    _VERSION;

    constructor(
        private http: HttpClient,
        private router: Router,
        protected authService: AuthService,
        private message: MensajeService,
        private translate: TranslateService,
        private changeDetector: ChangeDetectorRef
    ) {
        super(authService);
        this._VERSION = VERSION.hash;
        this.cmpReq = this.translate.instant('cmpReq');
    }

    ngAfterViewInit() {
        this.loadVersion();
        this.changeDetector.detectChanges();
    }

    ngOnInit() {
        this.authService.logout();
    }

    onLogin() {
        const header = new RequestHeaderModel(this.usu);
        const authModel1 = new AuthModelRequest(header, this.pass);

        // console.log('login1::', authModel1);
        this.submitted = true;
        this.authService.login(authModel1).subscribe((data: AuthModelResponse) => {
                // console.log('login2::', data);
                this.submitted = false;
                if (data && data.jwtToken) {
                    this.authService.loadMenu(data.menu);
                    this.authService.setUser(authModel1, data);
                    this.translate.use(data.language);

                    const saludo = this.translate.instant('login_succes') + ' ' + this.authService.getName();
                    this.message.showSuccess(saludo);
                    this.router.navigate(['home']);
                } else {
                    console.error('ST');
                    this.message.showError(this.translate.instant('login_error'));
                }
            },
            error => {
                this.submitted = false;
            });
    }

    goChange() {
        this.router.navigate(['changepass']);
    }

    togogleEyePass() {
        this.eyePass = !this.eyePass;
    }

    loadVersion() {
        this.versionServer(this._VERSION);
    }

    versionServer(response: string) {
        const url = window.location.href.toString().split('#')[0] + 'assets/version.json';
        const headers = new HttpHeaders()
            .set('Cache-Control', 'no-cache')
            .set('Pragma', 'no-cache');
        this.http.get<{ hash: any }>(url, {headers})
            .subscribe(config => {
                if (response !== config.hash) {
                    window.location.reload();
                }
            });
    }
}
