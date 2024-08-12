export class CorteValeModel {
    public ventaId: number;
    public ventaCorteId: number;
    public cantidad: number;
    public monto: number;
    public montoPorDescuento: number;
    public impreso: number;

    // similar al campo total, pero esta vez asignado por quien usa el objeto CorteValeModel
    public totalMontoAsignado: number;

    constructor(ventaId?: number,
                ventaCorteId?: number,
                cantidad?: number,
                monto?: number,
                montoPorDescuento?: number,
                impreso?: number) {
        this.ventaId = ventaId;
        this.ventaCorteId = ventaCorteId || 0;
        this.cantidad = cantidad;
        this.monto = monto;
        this.montoPorDescuento = montoPorDescuento;
        this.impreso = impreso;

        this.totalMontoAsignado = 0;
    }

    public static clone = (corteVale: CorteValeModel): CorteValeModel =>
        new CorteValeModel(corteVale.ventaId,
            corteVale.ventaCorteId,
            corteVale.cantidad,
            corteVale.monto,
            corteVale.montoPorDescuento,
            corteVale.impreso)

    public get total(): number {
        return Number((this.cantidad * (this.monto + this.montoPorDescuento)).toFixed(2));
    }
}
