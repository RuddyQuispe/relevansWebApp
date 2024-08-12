export class GenericSearchResponseModel {
    public codigo?: number;
    public descripcion: string;

    constructor(codigo?: number, descripcion?: string) {
        this.codigo = codigo;
        this.descripcion = descripcion;
    }
}
