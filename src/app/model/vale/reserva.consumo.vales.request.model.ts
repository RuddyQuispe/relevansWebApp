export class ReservaConsumoValesRequestModel {
    public idTrans: string;
    public fecha: string;
    public caja: string;
    public cajero: string;
    public list: Array<ReservaValeRequestModel>


    constructor(idTrans?: string,
                fecha?: string,
                caja?: string,
                cajero?: string,
                list?: Array<ReservaValeRequestModel>) {
        this.idTrans = idTrans;
        this.fecha = fecha;
        this.caja = caja;
        this.cajero = cajero;
        this.list = list;
    }
}

export class ReservaValeRequestModel {
    public hash: string;
    public importe: number;

    constructor(hash?: string, importe?: number) {
        this.hash = hash;
        this.importe = importe;
    }
}