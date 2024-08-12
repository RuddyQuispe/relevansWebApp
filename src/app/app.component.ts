import {Component, OnInit} from '@angular/core';
import {PrimeNGConfig} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '@services/auth.service';
import {AuthModel} from '@app/model/auth';
import {Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit{

    layoutMode = 'horizontal';
    lightMenu = true;
    topbarColor = 'layout-topbar-red';
    inlineUser = false;
    isRTL = false;
    inputStyle = 'filled'; // outlined
    ripple = true;

    currentUser: AuthModel;

    constructor(
        private primengConfig: PrimeNGConfig,
        private translate: TranslateService,
        private authService: AuthService,
        private router: Router,
    ){
        this.authService.currentUser.subscribe(x => this.currentUser = x);
        this.setAppLanguage();
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
    }

    setAppLanguage() {
        this.translate.setDefaultLang('es');
        const lan = this.authService.getLanguage();
        if (lan === undefined || lan == null) {
            // this.translate.use(this.translate.getBrowserLang());
        } else {
            this.translate.use(lan);
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
