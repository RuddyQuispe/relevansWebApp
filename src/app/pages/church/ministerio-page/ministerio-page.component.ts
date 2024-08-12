import {Component, OnInit} from '@angular/core';
import {MinisterioModel} from '@models/church';
import {CONFIG} from '@config/config';
import {ConfirmationService} from 'primeng/api';
import {MensajeService} from '@app/error/mensaje.service';

@Component({
    selector: 'app-ministerio-page',
    templateUrl: './ministerio-page.component.html',
    styleUrls: ['./ministerio-page.component.scss']
})
export class MinisterioPageComponent implements OnInit {
    protected ministerios: Array<MinisterioModel> = [
        {idMinisterio: 1, nombre: 'Ministerio 1', descripcion: 'descripcion mniisterio 1'},
        {idMinisterio: 2, nombre: 'Ministerio 2', descripcion: 'descripcion mniisterio 2'}
    ];
    protected rowsTables: number = Number(CONFIG.ROWS_TABLE);
    protected loading: boolean = Boolean(false);
    protected ministerio?: MinisterioModel;
    protected isView: boolean = Boolean(false);
    protected displayDialog: boolean = Boolean(false);


    constructor(private confirmationService: ConfirmationService,
                private messageService: MensajeService) {
    }

    public ngOnInit(): void {
    }

    public onClickAddMinisterio(): void {
        this.ministerio = new MinisterioModel();
        this.displayDialog = true;
        this.isView = false;
    }

    public onClickShowDialogToEdit(ministerio: MinisterioModel): void {
        this.ministerio = MinisterioModel.clone(ministerio);
        this.displayDialog = true;
        this.isView = false;
    }

    public onClickShowDialogToView(ministerio: MinisterioModel): void {
        this.ministerio = MinisterioModel.clone(ministerio);
        this.displayDialog = true;
        this.isView = true;
    }

    public closeDialog(): void {
        this.ministerio = null;
        this.displayDialog = false;
        this.isView = false;
    }

    public onSubmitMinisterio(): void {
        this.confirmationService.confirm({
            header: 'Ministerio',
            message: `¿Está seguro ${this.ministerio.idMinisterio ? 'modificar' : 'guardar'} este ministerio?`,
            accept: () => this.ministerio.idMinisterio ? this.modificarMinisterio() : this.guardarMinisterio()
        });
    }

    public onClickCancelDialog = (): void => this.closeDialog();

    private guardarMinisterio(): void {
        this.messageService.showSuccess('ministerio guardado correctamente');
        this.closeDialog();
    }

    private modificarMinisterio(): void {
        this.messageService.showSuccess('ministerio actualizado correctamente');
        this.closeDialog();
    }
}
