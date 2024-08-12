import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {decryptParam} from '@app/utils/params.security.utils';
import {EventoModel, MinisterioModel} from '@models/church';

@Component({
    selector: 'app-evento-register-page',
    templateUrl: './evento-register-page.component.html',
    styleUrls: ['./evento-register-page.component.scss']
})
export class EventoRegisterPageComponent implements OnInit {

    protected isView: boolean = Boolean(false);
    protected evento?: EventoModel;
    protected ministeriosOptions: Array<MinisterioModel> = [
        {idMinisterio: 1, nombre: 'ministerio 1', descripcion: 'desc ministerio 1'},
        {idMinisterio: 2, nombre: 'ministerio 2', descripcion: 'desc ministerio 2'},
        {idMinisterio: 3, nombre: 'ministerio 3', descripcion: 'desc ministerio 3'},
        {idMinisterio: 4, nombre: 'ministerio 4', descripcion: 'desc ministerio 4'},
    ];

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.route.params.subscribe((params: Params): void => {
            const {id, isView} = JSON.parse(decryptParam(params.data));
            this.evento = new EventoModel();
            if (!id) {
                this.evento = new EventoModel(
                    id, new Date().toString(), `evento ${id}`, `descripcion evento ${id}`, 'HABILITADO', null, [
                        {idMinisterio: 1, nombre: 'ministerio 1', descripcion: 'desc ministerio 1'}]);
            }
        });
    }

    onSubmitEvento() {

    }
}
