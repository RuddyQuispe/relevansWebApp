export class AutorizacionRequestModel {
    public ventaId: number;
    public autorizacion: boolean;

    constructor(VentaId?: number, autorizacion?: boolean) {
        this.ventaId = VentaId || 0;
        this.autorizacion = autorizacion || false;
    }
}
