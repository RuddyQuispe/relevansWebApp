import {Component, OnInit} from '@angular/core';
import {PlaylistModel} from '@models/church';
import {CONFIG} from '@config/config';
import {ConfirmationService} from 'primeng/api';
import {MensajeService} from '@app/error/mensaje.service';

@Component({
    selector: 'app-playlist-page',
    templateUrl: './playlist-page.component.html',
    styleUrls: ['./playlist-page.component.scss']
})
export class PlaylistPageComponent implements OnInit {
    protected playlists: Array<PlaylistModel> = [];
    protected rowsTables: number = Number(CONFIG.ROWS_TABLE);
    protected loading: boolean = Boolean(false);
    protected isView: boolean = Boolean(false);
    protected playlist?: PlaylistModel;
    protected displayDialog: boolean = Boolean(false);

    constructor(private confirmationService: ConfirmationService,
                private messageService: MensajeService) {
    }

    public ngOnInit(): void {
    }

    public onClickAddPlaylist(): void {
        this.openDialog(new PlaylistModel(), false);
    }

    public onClickShowDialogToEdit(playlist: PlaylistModel): void {
        this.openDialog(PlaylistModel.clone(playlist), false);
    }

    public onClickShowDialogToView(playlist: PlaylistModel): void {
        this.openDialog(PlaylistModel.clone(playlist), true);
    }

    public closeDialog(): void {
        this.displayDialog = false;
        this.isView = false;
        this.playlist = null;
    }

    public onSubmitPlaylist(): void {
        this.confirmationService.confirm({
            header: 'Playlist',
            message: `¿Estas seguro de ${this.playlist.idPlaylits ? 'modificar' : 'guardar'} este playlist?`,
            accept: (): void => this.playlist.idPlaylits ? this.updatePlaylist() : this.savePlaylist()
        });
    }

    public onClickCancelDialog = (): void => this.closeDialog()

    private openDialog(playlistModel: PlaylistModel, isView: boolean): void {
        this.playlist = playlistModel;
        this.displayDialog = true;
        this.isView = isView;
    }

    private savePlaylist(): void {
        this.messageService.showSuccess('playlist guardado correctamente');
        this.closeDialog();
    }

    private updatePlaylist(): void {
        this.messageService.showSuccess('playlist actualizado correctamente');
        this.closeDialog();
    }
}
