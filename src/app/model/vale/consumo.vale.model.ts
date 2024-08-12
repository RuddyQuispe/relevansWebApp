import {ValeModel} from "@models/vale/vale.model";

export class ConsumoValeModel {
    public consumoId: number;
    public idTransaccionSE: string;
    public codReserva: string;
    public cajero: string;
    public caja: string
    public cvia: number;
    public npag: number;
    public fecha: Date;
    public importe: number;
    public login: string;
    public factura: string;
    public tipoConsumo: string;
    public estado: string;
    public lastUser: string;
    public lastTime: Date;
    public vale: ValeModel;
}
