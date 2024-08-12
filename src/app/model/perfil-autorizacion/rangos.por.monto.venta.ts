export class RangosPorMontoVenta {
    public rangoPorMontoVentaId: number;
    public min: number;
    public max: number;
    public requiereAutorizacion: boolean;
    public requiereValidacion: boolean;
    public estado: boolean;
    public moneda: string;
    public lastUser: string;
    public lastTime: Date;
    public perfilAutorizadorId: number;


    constructor(rangosPorMontoVentaId?: number,
                min?: number,
                max?: number,
                autorizacionVenta?: boolean,
                validacionContableVenta?: boolean,
                estado?: boolean,
                moneda?: string,
                lastUser?: string,
                lastTime?: Date,
                perfilAutorizadorId?: number) {
        this.rangoPorMontoVentaId = rangosPorMontoVentaId;
        this.min = min;
        this.max = max;
        this.requiereAutorizacion = autorizacionVenta ?? false;
        this.requiereValidacion = validacionContableVenta ?? false;
        this.estado = estado ?? false;
        this.moneda = moneda;
        this.lastUser = lastUser;
        this.lastTime = lastTime ?? new Date();
        this.perfilAutorizadorId = perfilAutorizadorId;
    }

    public static clone = (profilePermissionModel: RangosPorMontoVenta) =>
        new RangosPorMontoVenta(
            profilePermissionModel.rangoPorMontoVentaId,
            profilePermissionModel.min,
            profilePermissionModel.max,
            profilePermissionModel.requiereAutorizacion,
            profilePermissionModel.requiereValidacion,
            profilePermissionModel.estado,
            profilePermissionModel.moneda.toString(),
            profilePermissionModel.lastUser,
            profilePermissionModel.lastTime,
            profilePermissionModel.perfilAutorizadorId)
}
