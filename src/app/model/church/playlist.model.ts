import {CancionModel} from '@models/church';

export class PlaylistModel {
    public idPlaylits: number;
    public fechaRegistro: string;
    public info: string;
    public lastUser: string;
    public name: string;
    public url: string;
    public canciones: Array<CancionModel>;

    constructor(idPlaylits?: number,
                fechaRegistro?: string,
                info?: string,
                lastUser?: string,
                name?: string,
                url?: string,
                canciones?: Array<CancionModel>) {
        this.idPlaylits = idPlaylits;
        this.fechaRegistro = fechaRegistro;
        this.info = info;
        this.lastUser = lastUser;
        this.name = name;
        this.url = url;
        this.canciones = canciones;
    }

    public static clone = (playlist: PlaylistModel): PlaylistModel =>
        new PlaylistModel(
            playlist.idPlaylits,
            playlist.fechaRegistro,
            playlist.info,
            playlist.lastUser,
            playlist.name,
            playlist.url,
            playlist.canciones)
}
