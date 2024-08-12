import {PlaylistModel} from '@models/church';

export class CancionModel {
    public idCancion: number;
    public nombre: string;
    public descripcion: string;
    public playlist: PlaylistModel;


    constructor(idCancion?: number, nombre?: string, descripcion?: string, playlist?: PlaylistModel) {
        this.idCancion = idCancion;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.playlist = playlist;
    }

    public static clone = (cancion: CancionModel): CancionModel =>
        new CancionModel(
            cancion.idCancion,
            cancion.nombre,
            cancion.descripcion,
            cancion.playlist)
}
