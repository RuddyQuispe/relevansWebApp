import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {ChangeComponent} from '@pages/change/change.component';
import {AppMainComponent} from '@app/app.main.component';
import {AuthGuard} from '@app/guard/auth.guard';
import {HomeComponent} from '@pages/home/home.component';
import {DomainComponent} from '@pages/domain/domain.component';
import {WebserviceComponent} from '@pages/webservice/webservice.component';
import {AppLoginComponent} from '@pages/login/app.login.component';
import {AppErrorComponent} from '@pages/app.error.component';
import {AppAccessdeniedComponent} from '@pages/app.accessdenied.component';
import {AppNotfoundComponent} from '@pages/app.notfound.component';
import {UsuarioPageComponent} from '@pages/church/usuario-page/usuario-page.component';
import {MinisterioPageComponent} from '@pages/church/ministerio-page/ministerio-page.component';
import {EventoPageComponent} from '@pages/church/evento-page/evento-page.component';
import {EventoRegisterPageComponent} from '@pages/church/eventos/evento-register-page/evento-register-page.component';
import {PlaylistPageComponent} from '@pages/church/playlist-page/playlist-page.component';
import {CancionPageComponent} from '@pages/church/cancion-page/cancion-page.component';


export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'home'},
    {
        path: 'home', component: AppMainComponent, canActivate: [AuthGuard],
        children: [{path: '', component: HomeComponent}]
    },
    {
        path: 'users', component: AppMainComponent, canActivate: [AuthGuard],
        children: [{path: '', component: UsuarioPageComponent}]
    },
    {
        path: 'iglesia', component: AppMainComponent, canActivate: [AuthGuard],
        children: [
            {path: 'ministerio', component: MinisterioPageComponent},
            {
                path: 'evento', children: [
                    {path: '', component: EventoPageComponent},
                    {path: ':data', component: EventoRegisterPageComponent}
                ]
            }
        ]
    },
    {
        path: 'rolitas', component: AppMainComponent, canActivate: [AuthGuard],
        children: [
            {path: 'playlist', component: PlaylistPageComponent},
            {path: 'cancion', component: CancionPageComponent}
        ]
    },
    {path: 'login', component: AppLoginComponent},
    {path: 'changepass', component: ChangeComponent},
    {path: 'error', component: AppErrorComponent},
    {path: 'access', component: AppAccessdeniedComponent},
    {path: '404', component: AppNotfoundComponent},
    {path: '**', redirectTo: '/404'}
];

export const AppRoutes: ModuleWithProviders<any> = RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
});
