import {Component, OnInit} from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {AppComponent} from '../app.component';
import {AppMainComponent} from '../app.main.component';
import {MenuItem} from "primeng/api";

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    animations: [
        trigger('inline', [
            state('hidden', style({
                height: '0px',
                overflow: 'hidden'
            })),
            state('visible', style({
                height: '*',
            })),
            state('hiddenAnimated', style({
                height: '0px',
                overflow: 'hidden'
            })),
            state('visibleAnimated', style({
                height: '*',
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppMenuComponent implements OnInit {

    model: MenuItem[];

    constructor(public app: AppComponent, public appMain: AppMainComponent) {
    }

    ngOnInit() {
        this.model = [
            {label: 'Home', icon: 'pi pi-home', routerLink: ['/home']},
            {label: 'Usuario', icon: 'pi pi-users', routerLink: ['/users']},
            {
                label: 'Iglesia', icon: 'pi pi-home', items: [
                    {label: 'Ministerio', icon: 'pi pi-home', routerLink: ['/iglesia/ministerio']},
                    {label: 'Evento', icon: 'pi pi-home', routerLink: ['/iglesia/evento']}
                ]
            },
            {
                label: 'Rolitas', icon: 'pi pi-home', items: [
                    {label: 'Play list', icon: 'pi pi-home', routerLink: ['/rolitas/playlist']},
                    {label: 'Canción', icon: 'pi pi-home', routerLink: ['/rolitas/cancion']}
                ]
            }
        ];
    }

    onMenuClick(event) {
        this.appMain.onMenuClick(event);
    }
}
