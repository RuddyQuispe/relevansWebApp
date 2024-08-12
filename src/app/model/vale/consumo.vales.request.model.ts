export class ConsumoValesRequestModel {
    public fecha: string;
    public factura: string;
    public list: Array<string>;

    constructor(fecha?: string, factura?: string, list?: Array<string>) {
        this.fecha = fecha;
        this.factura = factura;
        this.list = list;
    }
}