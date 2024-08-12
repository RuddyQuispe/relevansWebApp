export class ConsumerFilterModel {
    public fechaFin: string;
    public fechaInicio: string;
    public idTransaction: string;
    public caja: string;
    public cajero: string;
    public responseSAI: string;

    public orderBy: string;
    public direction: string;
    public page: number;
    public pageSize: number;

    public _fechaFinDate: Date;
    public _fechaInicioDate: Date;


    constructor(orderBy?: string, direction?: string, page?: number, pageSize?: number,
                idTransaction?: string, caja?: string, cajero?: string, responseSAI?: string, fechaInicio?: string,
                fechaFin?: string) {
        this.idTransaction = idTransaction;
        this.caja = caja;
        this.cajero = cajero;
        this.responseSAI = responseSAI;
        this.orderBy = orderBy;
        this.direction = direction;
        this.page = page;
        this.pageSize = pageSize;
        this.fechaFin = fechaFin || new Date().toString();
        this.fechaInicio = fechaInicio || new Date().toString();

        this._fechaFinDate = new Date(this.fechaInicio);
        this._fechaInicioDate = new Date(this.fechaFin);
    }

    public static clone = (filterConsumerVoucher: ConsumerFilterModel): ConsumerFilterModel =>
        new ConsumerFilterModel(
            filterConsumerVoucher.orderBy,
            filterConsumerVoucher.direction,
            filterConsumerVoucher.page,
            filterConsumerVoucher.pageSize,
            filterConsumerVoucher.idTransaction === '' ? null : filterConsumerVoucher.idTransaction,
            filterConsumerVoucher.caja === '' ? null : filterConsumerVoucher.caja,
            filterConsumerVoucher.cajero === '' ? null : filterConsumerVoucher.cajero,
            filterConsumerVoucher.responseSAI === '' ? null : filterConsumerVoucher.responseSAI,
            filterConsumerVoucher.fechaInicio === '' ? null : filterConsumerVoucher.fechaInicio,
            filterConsumerVoucher.fechaFin === '' ? null : filterConsumerVoucher.fechaFin
        )
}
