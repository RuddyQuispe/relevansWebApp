export class ReservaConsumoValesResponseModel {
    public list: Array<ReservaValeResponseModel>
}

export class ReservaValeResponseModel {
    public header: { codigo: string, descripcion: string };
    public hash: string;
    public codigoReserva: string;
    public retenerFactura: boolean;
    public importe: number;
    public moneda: number;
}