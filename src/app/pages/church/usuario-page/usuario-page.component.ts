import {Component, OnInit} from '@angular/core';
import {UsuarioModel} from '@models/church';
import {CONFIG} from '@config/config';
import {SelectItem} from 'primeng/api';

@Component({
    selector: 'app-usuario-page',
    templateUrl: './usuario-page.component.html',
    styleUrls: ['./usuario-page.component.scss']
})
export class UsuarioPageComponent implements OnInit {
    protected usuarios: Array<UsuarioModel> = [
        new UsuarioModel(1, 'hola@gmail.com', 'DEVICE1', null, 'user1', [])
    ];
    protected rowsTables: number = Number(CONFIG.ROWS_TABLE);
    protected loading: boolean = Boolean(false);
    protected usuario?: UsuarioModel;
    protected isView: boolean = Boolean(false);
    protected displayDialog: boolean = Boolean(false);
    protected ministeriosOptions: Array<SelectItem> = new Array<SelectItem>();
    protected eyePass: boolean = Boolean(false);

    constructor() {
    }

    ngOnInit(): void {
    }

    public onClickAddUsuario(): void {
        this.usuario = new UsuarioModel();
        this.displayDialog = true;
        this.isView = false;
    }

    public showDialogToEdit(usuario: UsuarioModel): void {
        this.usuario = UsuarioModel.clone(usuario);
        this.displayDialog = true;
        this.isView = false;
    }

    protected showDialogToView(usuario: UsuarioModel): void {
        this.usuario = UsuarioModel.clone(usuario);
        this.displayDialog = true;
        this.isView = true;
    }

    onSubmitUsuario() {

    }

    public closeDialog(): void {
        this.displayDialog = false;
        this.usuario = null;
        this.isView = false;
    }

    togogleEyePass() {

    }

    public onClickCancelDialog(): void {
        this.closeDialog();
    }
}
