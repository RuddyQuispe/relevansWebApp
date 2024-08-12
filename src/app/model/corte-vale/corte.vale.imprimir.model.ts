export class CorteValeImprimirModel {
    public corteId: number;
    public cantidad: number;
    public ventaId: number;

    constructor(corteId?: number, cantidad?: number, ventaId?: number) {
        this.corteId = corteId;
        this.cantidad = cantidad;
        this.ventaId = ventaId;
    }
}
