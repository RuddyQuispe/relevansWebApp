export class VentaFiltroModel {
    public fechaInicio: string;
    public fechaFin: string;
    public ventaId?: number;
    public clienteNit?: string;
    public estados: Array<string>;
    public clienteNombre?: string;
    public nombreUsuario?: string;
    public moneda?: string;

    public orderBy: string;
    public direction: string;
    public page: number;
    public pageSize: number;

    public fechaInicioDate: Date;
    public fechaFinDate: Date;
    public usuarioVenta: number;


    constructor(orderBy: string,
                direction: string,
                page: number,
                pageSize: number,
                fechaInicio?: string,
                fechaFin?: string,
                ventaId?: number,
                clienteNit?: string,
                estados?: Array<string>,
                nombreCliente?: string,
                nombreUsuario?: string,
                usuarioVenta?: number,
                moneda?: string) {
        this.fechaInicio = fechaInicio ?? new Date().toString();
        this.fechaFin = fechaFin ?? new Date().toString();
        this.ventaId = ventaId;
        this.clienteNit = clienteNit;
        this.estados = estados ?? [];
        this.clienteNombre = nombreCliente;
        this.moneda = moneda;


        this.orderBy = orderBy;
        this.direction = direction;
        this.page = page;
        this.pageSize = pageSize;

        this.usuarioVenta = usuarioVenta;
        this.nombreUsuario = nombreUsuario;
    }

    public static clone(ventaFilterModel: VentaFiltroModel): VentaFiltroModel {
        return new VentaFiltroModel(
            ventaFilterModel.orderBy,
            ventaFilterModel.direction,
            ventaFilterModel.page,
            ventaFilterModel.pageSize,
            ventaFilterModel.fechaInicio,
            ventaFilterModel.fechaFin,
            ventaFilterModel.ventaId,
            ventaFilterModel.clienteNit === '' ? null : ventaFilterModel.clienteNit,
            ventaFilterModel.estados,
            ventaFilterModel.clienteNombre === '' ? null : ventaFilterModel.clienteNombre,
            ventaFilterModel.nombreUsuario === '' ? null : ventaFilterModel.nombreUsuario,
            ventaFilterModel.usuarioVenta,
            ventaFilterModel.moneda);
    }

    // public clone = (): VentaFiltroModel => {
    //     return new VentaFiltroModel(
    //         this.orderBy,
    //         this.direction,
    //         this.page,
    //         this.pageSize,
    //         this.fechaInicio,
    //         this.fechaFin,
    //         this.ventaId,
    //         this.clienteNit === '' ? null : this.clienteNit,
    //         this.estado === OPTION_ALL ? null : this.estado,
    //         this.nombreCliente === '' ? null : this.nombreCliente,
    //         this.nombreUsuario === '' ? null : this.nombreUsuario
    //     );
    // }
}
