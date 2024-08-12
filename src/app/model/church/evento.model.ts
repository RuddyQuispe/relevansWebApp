import {MinisterioModel} from '@models/church';

export class EventoModel {
    public idEvento: number;
    public fecha: string;
    public nombre: string;
    public descripcion: string;
    public estado: string;
    public lastUser: string;
    public ministerios: Array<MinisterioModel>;

    public fechaDate: Date;


    constructor(idEvento?: number,
                fecha?: string,
                nombre?: string,
                descripcion?: string,
                estado?: string,
                lastUser?: string,
                ministerios?: Array<MinisterioModel>) {
        this.idEvento = idEvento;
        this.fecha = fecha ?? new Date().toString();
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.estado = estado;
        this.lastUser = lastUser;
        this.ministerios = ministerios ?? [];
        this.fechaDate = new Date(this.fecha);
    }

    public static clone = (evento: EventoModel): EventoModel =>
        new EventoModel(evento.idEvento,
            evento.fecha,
            evento.nombre,
            evento.descripcion,
            evento.estado,
            evento.lastUser,
            evento.ministerios)
}