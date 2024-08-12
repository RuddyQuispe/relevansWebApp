export class ValeFilterModel {
    public fechaInicio: string;
    public fechaFin: string;
    public identificadorQr: string;
    public estado: string;
    public importe: string;
    public moneda: number;
    public beneficiario: string;

    public orderBy: string;
    public direction: string;
    public page: number;
    public pageSize: number;

    public fechaInicioDate: Date;
    public fechaFinDate: Date;


    constructor(orderBy?: string, direction?: string, page?: number, pageSize?: number, fechaInicio?: string,
                fechaFin?: string, identificadorQr?: string, estado?: string, importe?: string, moneda?: number, beneficiario?: string) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.identificadorQr = identificadorQr;
        this.estado = estado;
        this.importe = importe;
        this.moneda = moneda;
        this.orderBy = orderBy;
        this.direction = direction;
        this.page = page;
        this.pageSize = pageSize;
        this.fechaInicioDate = new Date(fechaInicio);
        this.fechaFinDate = new Date(fechaFin);
        this.beneficiario = beneficiario;
    }

    public static clone = (voucherFilter: ValeFilterModel): ValeFilterModel =>
        new ValeFilterModel(
            voucherFilter.orderBy,
            voucherFilter.direction,
            voucherFilter.page,
            voucherFilter.pageSize,
            voucherFilter.fechaInicio,
            voucherFilter.fechaFin,
            voucherFilter.identificadorQr,  // === '' ? null : this.valeId,
            voucherFilter.estado === '' ? null : voucherFilter.estado,
            voucherFilter.importe, // === '' ? null : this.importe,
            voucherFilter.moneda === -1 ? null : voucherFilter.moneda,
            voucherFilter.beneficiario === '' ? null : voucherFilter.beneficiario
        )

    // constructor(orderBy?: string, direction?: string, page?: number, pageSize?: number,
    //             fechaInicio?: string, fechaFin?: string, numeroVale?: number) {
    //     this.fechaInicio = fechaInicio;
    //     this.fechaFin = fechaFin;
    //     this.valeId = numeroVale;
    //     this.orderBy = orderBy;
    //     this.direction = direction;
    //     this.page = page;
    //     this.pageSize = pageSize;
    //
    //     this.fechaInicioDate = new Date(fechaInicio);
    //     this.fechaFinDate = new Date(fechaFin);
    // }
}