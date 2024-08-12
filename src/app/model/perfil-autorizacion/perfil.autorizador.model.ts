import {RangosPorMontoVenta} from './rangos.por.monto.venta';

export class PerfilAutorizadorModel {
    public perfilAutorizadorId: number;
    public nombre: string;
    public descripcion: string;
    public lastUser: string;
    public lastTime: Date;
    public rangosPorMontoVenta: Array<RangosPorMontoVenta>;

    public static PERFIL_AUTORIZADOR_ID_PROPERTY: string = 'perfilAutorizadorId';


    constructor(perfilAutorizadorId?: number,
                nombre?: string,
                descripcion?: string,
                lastUser?: string,
                lastTime?: Date,
                perfilAutorizadorPermiso?: Array<RangosPorMontoVenta>) {
        this.perfilAutorizadorId = perfilAutorizadorId;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.lastUser = lastUser;
        this.lastTime = lastTime || new Date();
        this.rangosPorMontoVenta = perfilAutorizadorPermiso || [];
    }

    public static clone = (authorizationProfile: PerfilAutorizadorModel): PerfilAutorizadorModel =>
        new PerfilAutorizadorModel(authorizationProfile.perfilAutorizadorId,
            authorizationProfile.nombre,
            authorizationProfile.descripcion,
            authorizationProfile.lastUser,
            authorizationProfile.lastTime,
            authorizationProfile.rangosPorMontoVenta);
}
