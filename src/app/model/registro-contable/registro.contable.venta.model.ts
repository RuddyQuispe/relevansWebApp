export class RegistroContableVentaModel {
    public registroContableId: number;
    public ventaId: number;
    public ncxc: number;
    public ncxp: number;
    public ncob: number;
    public estado: string;


    constructor(registroContableId?: number, ventaId?: number, ncxc?: number, ncxp?: number, ncob?: number, estado?: string) {
        this.registroContableId = registroContableId;
        this.ventaId = ventaId;
        this.ncxc = ncxc;
        this.ncxp = ncxp;
        this.ncob = ncob;
        this.estado = estado;
    }

}