import {UserModel} from '@models/user';

export class SistemaExternoModel {
    public sistemaExternoId: number;
    public codigo: string;
    public descripcion: string;
    public estado: boolean;
    public lastTime: string;
    public lastUser: string;
    public usuarios: Array<UserModel>;
    public static SISTEMA_EXTERNO_ID: string = 'sistemaExternoId';

    constructor(sistemaExternoId?: number,
                codigo?: string,
                descripcion?: string,
                estado?: boolean,
                lastTime?: string,
                lastUser?: string) {
        this.sistemaExternoId = sistemaExternoId || null;
        this.codigo = codigo || null;
        this.descripcion = descripcion || null;
        this.estado = estado || false;
        this.lastTime = lastTime || new Date().toString();
        this.lastUser = lastUser;
    }

    public static clone = (sistemaExternoModel: SistemaExternoModel): SistemaExternoModel =>
        new SistemaExternoModel(sistemaExternoModel.sistemaExternoId,
            sistemaExternoModel.codigo,
            sistemaExternoModel.descripcion,
            sistemaExternoModel.estado,
            sistemaExternoModel.lastTime,
            sistemaExternoModel.lastUser)

    public static getPropertyMain = (): string =>
        Object.getOwnPropertyNames(SistemaExternoModel.prototype)[0]
}
