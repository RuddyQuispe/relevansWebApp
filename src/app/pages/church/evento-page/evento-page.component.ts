import {Component, OnInit} from '@angular/core';
import {EventoModel, MinisterioModel} from '@models/church';
import {CONFIG} from '@config/config';
import {ConfirmationService} from 'primeng/api';
import {MensajeService} from '@app/error/mensaje.service';
import {Router} from '@angular/router';
import {encryptParam} from '@app/utils/params.security.utils';

@Component({
    selector: 'app-evento-page',
    templateUrl: './evento-page.component.html',
    styleUrls: ['./evento-page.component.scss']
})
export class EventoPageComponent implements OnInit {
    protected eventos: Array<EventoModel> = [];
    protected rowsTables: number = Number(CONFIG.ROWS_TABLE);
    protected loading: boolean = Boolean(false);
    protected displayDialog: boolean = Boolean(false);

    constructor(private router: Router) {
    }

    public ngOnInit(): void {
    }

    public onClickAddEvento(): void {
        this.router.navigate(['/iglesia/evento', encryptParam(JSON.stringify({
                id: null, isView: false
            }
        ))]);
        // private confirmationService: ConfirmationService,
        //         private messageService: MensajeService
        // this.openDialog(new EventoModel(), false);
    }

    public onClickShowDialogToEdit(evento: EventoModel): void {
        this.router.navigate(['/iglesia/evento', encryptParam(JSON.stringify({
            id: evento.idEvento,
            isView: false
        }))]);
        // this.openDialog(EventoModel.clone(evento), false);
    }

    public onClickShowDialogToView(evento: EventoModel): void {
        this.router.navigate(['/iglesia/evento', encryptParam(JSON.stringify({
            id: evento.idEvento,
            isView: true
        }))]);
        // this.openDialog(EventoModel.clone(evento), true);
    }

    public closeDialog(): void {
        // this.displayDialog = false;
        // this.isView = false;
        // this.evento = null;
    }

    private openDialog(evento: EventoModel, isView: boolean): void {
        // this.evento = evento;
        // this.displayDialog = true;
        // this.isView = isView;
    }

    public onSubmitEvento() {
        // this.confirmationService.confirm({
        //     header: 'Evento',
        //     message: `¿Está seguro de ${this.evento.idEvento ? 'guardar' : 'modificar'} este evento?`,
        //     accept: () => this.evento.idEvento ? this.modificarEvento() : this.guardarEvento()
        // });
    }

    public onClickCancelDialog() {
        this.closeDialog();
    }

    private guardarEvento() {
        // this.messageService.showSuccess('evento guardado correctamente');
        // this.closeDialog();
    }

    private modificarEvento() {
        // this.messageService.showSuccess('evento modificado correctamente');
        // this.closeDialog();
    }
}
