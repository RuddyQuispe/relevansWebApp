import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LocationStrategy, HashLocationStrategy, registerLocaleData, DatePipe} from '@angular/common';
import {AppRoutes} from './app-routing.module';
import {LOCALE_ID} from '@angular/core';

import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {AuthInterceptor, ErrorInterceptor, LoaderInterceptorService} from './http-interceptors';
import {GlobalErrorHandler} from './error/global-error-handler';
import {Config} from '@services/config';
import {CheckboxModule} from 'primeng/checkbox';
import {TabViewModule} from 'primeng/tabview';
import {ProgressBarModule} from 'primeng/progressbar';
import localeEsBo from '@angular/common/locales/es-BO';
import {EncryptService} from '@services/encrypt.service';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {MessageModule} from 'primeng/message';
import {MultiSelectModule} from 'primeng/multiselect';
import {ChangeComponent} from '@pages/change/change.component';
import {
    AlphaNumericDirective,
    AlphaNumericNotSpaceDirective,
    AlphaNumericSpaceDirective, AlphaSpaceDirective, LoginUserDirective, NumericDecimalDirective,
    NumericDirective
} from '@app/components/directives';
import {LoaderComponent} from '@app/components/loader/loader.component';
import {LoaderService} from '@services/loader.service';
import {ToastModule} from 'primeng/toast';
import {MensajeService} from '@app/error/mensaje.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {HomeComponent} from '@pages/home/home.component';
import {MenuService} from '@app/template/app.menu.service';
import {DomainComponent} from '@pages/domain/domain.component';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {SelectButtonModule} from 'primeng/selectbutton';
import {WebserviceComponent} from '@pages/webservice/webservice.component';
import {JobComponent} from '@pages/job/job.component';
import {SpinnerModule} from 'primeng/spinner';
import {SliderModule} from 'primeng/slider';
import {CalendarModule} from 'primeng/calendar';
import {QueryComponent} from '@pages/query/query.component';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {EmailComponent} from '@pages/email/email.component';
import {LogwebComponent} from '@pages/logweb/logweb.component';
import {FieldsetModule} from 'primeng/fieldset';
import {DropdownModule} from 'primeng/dropdown';
import {ProfileComponent} from '@pages/profile/profile.component';
import {UserComponent} from '@pages/user/user.component';
import {AppComponent} from '@app/app.component';
import {AppMainComponent} from '@app/app.main.component';
import {AppMenuComponent} from '@app/template/app.menu.component';
import {AppMenuitemComponent} from '@app/template/app.menuitem.component';
import {AppRightMenuComponent} from '@app/template/app.right-menu.component';
import {AppTopBarComponent} from '@app/template/app.topbar.component';
import {AppFooterComponent} from '@app/template/app.footer.component';
import {AppNotfoundComponent} from '@pages/app.notfound.component';
import {AppErrorComponent} from '@pages/app.error.component';
import {AppAccessdeniedComponent} from '@pages/app.accessdenied.component';
import {AppLoginComponent} from '@pages/login/app.login.component';
import {TreeModule} from 'primeng/tree';
import {QRCodeModule} from 'angularx-qrcode';
import {PrivkeyComponent} from '@pages/privkey/privkey.component';
import {RadioButtonModule} from 'primeng/radiobutton';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {HiperCardComponent} from './components/hiper-card/hiper-card.component';
import {ParametrosSaiComponent} from '@pages/parametros-sai/parametros-sai.component';
import {VentaListaComponent} from '@pages/ventas/list-normal/venta-lista.component';
import {VentaComponent} from '@pages/ventas/venta-normal/venta.component';
import {AutorizacionVentasComponent} from '@pages/autorizacion-venta/autorizacion-ventas.component';
import {ValidacionContableListaComponent} from '@pages/validacion-contable/list/validacion-contable-lista.component';
import {ImpresionVentaListaComponent} from '@pages/impresion-venta/list/impresion-venta-lista.component';
import {
    DialogGenericSearchComponent
} from '@app/components/shared/dialog-generic-search/dialog-generic-search.component';
import {ValidacionContableComponent} from '@pages/validacion-contable/register/validacion-contable.component';
import {ImpresionVentaComponent} from '@pages/impresion-venta/printer/impresion-venta.component';
import {VoucherCutComponent} from './components/shared/voucher-cut/voucher-cut.component';
import {InputSwitchModule} from 'primeng/inputswitch';
import {VoucherListFilterComponent} from '@app/components/shared/voucher-list-filter/voucher-list-filter.component';
import {RenovateVouchersComponent} from '@pages/renovate-voucher/list/renovate-vouchers.component';
import {RenovateVoucherComponent} from '@pages/renovate-voucher/edit/renovate-voucher.component';
import {DivisionVouchersComponent} from '@pages/division-vouchers/list/division-vouchers.component';
import {DivisionVoucherComponent} from '@pages/division-vouchers/edit/division-voucher.component';
import {PrinterVouchersComponent} from '@pages/printer-voucher/list/printer-vouchers.component';
import {PrinterVoucherComponent} from '@pages/printer-voucher/edit/printer-voucher.component';
import {PunishmentVouchersComponent} from '@pages/punishment-voucher/punishment-vouchers.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {FileUploadModule} from 'primeng/fileupload';
import {TemplateExcelComponent} from '@pages/template-excel/template-excel.component';
import {ExternalSystemComponent} from '@pages/external-system/external-system.component';
import {ConsumerVoucherComponent} from '@pages/consumer-voucher/consumer-voucher.component';
import {SplitButtonModule} from 'primeng/splitbutton';
import {VentaDirectaComponent} from '@pages/ventas/venta-directa/venta.directa.component';
import {VentaListaDirectaComponent} from '@pages/ventas/lista-directa/venta-lista-directa.component';
import {VoucherConsumerReportComponent} from '@pages/voucher-consumer-report/voucher-consumer-report.component';
import {AuthorizationProfileComponent} from "@pages/authorization-profile/authorization-profile.component";
import {AccordionModule} from "primeng/accordion";
import {ListVoucherComponent} from '@pages/list-voucher/list-voucher.component';
import {MenuApiComponent} from '@pages/menu-api/menu-api.component';
import {StickyNoteComponent} from './components/shared/sticky-note/sticky-note.component';
import {TypeAppRequestPipe} from './pipes/type-app-request.pipe';
import {CurrentTypePipe} from './pipes/current-type.pipe';
import {MinisterioPageComponent} from './pages/church/ministerio-page/ministerio-page.component';
import {EventoPageComponent} from './pages/church/evento-page/evento-page.component';
import {PlaylistPageComponent} from './pages/church/playlist-page/playlist-page.component';
import {CancionPageComponent} from './pages/church/cancion-page/cancion-page.component';
import {UsuarioPageComponent} from './pages/church/usuario-page/usuario-page.component';
import {PickListModule} from "primeng/picklist";
import { EventoRegisterPageComponent } from './pages/church/eventos/evento-register-page/evento-register-page.component';

export function initializeApp(appConfig: Config) {
    registerLocaleData(localeEsBo, 'es');
    return () => appConfig.load();
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        HttpClientModule,
        RouterModule,
        CheckboxModule,
        TabViewModule,
        ProgressBarModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
        MessageModule,
        AppRoutes,
        ToastModule,
        TableModule,
        DialogModule,
        SelectButtonModule,
        SpinnerModule,
        SliderModule,
        CalendarModule,
        InputTextareaModule,
        FieldsetModule,
        DropdownModule,
        TreeModule,
        QRCodeModule,
        RadioButtonModule,
        ConfirmDialogModule,
        InputSwitchModule,
        ProgressSpinnerModule,
        FileUploadModule,
        SplitButtonModule,
        AccordionModule,
        MultiSelectModule,
        PickListModule,
    ],
    declarations: [
        AlphaNumericDirective,
        AlphaNumericSpaceDirective,
        AlphaNumericNotSpaceDirective,
        NumericDirective,
        AlphaSpaceDirective,
        LoginUserDirective,
        NumericDecimalDirective,
        LoaderComponent,
        AppComponent,
        AppMainComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppRightMenuComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppNotfoundComponent,
        AppErrorComponent,
        AppAccessdeniedComponent,
        AppLoginComponent,
        ChangeComponent,
        HomeComponent,
        DomainComponent,
        WebserviceComponent,
        JobComponent,
        QueryComponent,
        EmailComponent,
        LogwebComponent,
        ProfileComponent,
        UserComponent,
        PrivkeyComponent,
        HiperCardComponent,
        ParametrosSaiComponent,
        VentaListaComponent,
        VentaComponent,
        AutorizacionVentasComponent,
        ValidacionContableListaComponent,
        ImpresionVentaListaComponent,
        DialogGenericSearchComponent,
        ValidacionContableComponent,
        ImpresionVentaComponent,
        VoucherCutComponent,
        VoucherListFilterComponent,
        RenovateVouchersComponent,
        RenovateVoucherComponent,
        DivisionVouchersComponent,
        DivisionVoucherComponent,
        PrinterVouchersComponent,
        PrinterVoucherComponent,
        PunishmentVouchersComponent,
        TemplateExcelComponent,
        ExternalSystemComponent,
        ConsumerVoucherComponent,
        VentaDirectaComponent,
        VentaListaDirectaComponent,
        VoucherConsumerReportComponent,
        AuthorizationProfileComponent,
        ListVoucherComponent,
        MenuApiComponent,
        StickyNoteComponent,
        TypeAppRequestPipe,
        CurrentTypePipe,
        MinisterioPageComponent,
        EventoPageComponent,
        PlaylistPageComponent,
        CancionPageComponent,
        UsuarioPageComponent,
        EventoRegisterPageComponent
    ],
    providers: [
        Config,
        EncryptService,
        LoaderService,
        {provide: APP_INITIALIZER, useFactory: initializeApp, deps: [Config], multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        {provide: ErrorHandler, useClass: GlobalErrorHandler},
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {provide: LOCALE_ID, useValue: 'es-BO'},
        MessageService,
        MensajeService,
        DatePipe,
        MenuService,
        ConfirmationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
