import {Component, OnInit} from '@angular/core';
import {CancionModel} from '@models/church';
import {CONFIG} from '@config/config';
import {ConfirmationService} from 'primeng/api';
import {MensajeService} from '@app/error/mensaje.service';

@Component({
    selector: 'app-cancion-page',
    templateUrl: './cancion-page.component.html',
    styleUrls: ['./cancion-page.component.scss']
})
export class CancionPageComponent implements OnInit {
    protected canciones: Array<CancionModel> = [];
    protected cancion?: CancionModel;

    protected rowsTables: number = Number(CONFIG.ROWS_TABLE);
    protected loading: boolean = Boolean(false);
    protected isView: boolean = Boolean(false);
    protected displayDialog: boolean = Boolean(false);

    constructor(private confirmationService: ConfirmationService,
                private messageService: MensajeService) {
    }

    public ngOnInit(): void {
    }

    public onClickAddCancion(): void {
        this.openDialog(new CancionModel(), false);
    }

    public onClickShowDialogToEdit(cancion: CancionModel): void {
        this.openDialog(CancionModel.clone(cancion), false);
    }

    public onClickShowDialogToView(cancion: CancionModel): void {
        this.openDialog(CancionModel.clone(cancion), true);
    }

    protected closeDialog(): void {
        this.displayDialog = false;
        this.isView = false;
        this.cancion = null;
    }

    public onSubmitCancion(): void {
        this.confirmationService.confirm({
            header: 'Cancíón',
            message: `¿Estas seguro de ${this.cancion.idCancion ? 'modificar' : 'guardar'} esta canción?`,
            accept: (): void => this.cancion.idCancion ? this.saveCancion() : this.updateCancion()
        });
    }

    public onClickCancelDialog(): void {
        this.closeDialog();
    }

    private openDialog(cancionModel: CancionModel, isView: boolean): void {
        this.cancion = cancionModel;
        this.displayDialog = true;
        this.isView = isView;
    }

    private saveCancion(): void {
        this.messageService.showSuccess('canción guardada correctamente');
        this.closeDialog();
    }

    private updateCancion(): void {
        this.messageService.showSuccess('canción actualizada correctamente');
        this.closeDialog();
    }
}
