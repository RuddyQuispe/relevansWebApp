export class MinisterioModel {
    public idMinisterio: number;
    public nombre: string;
    public descripcion: string;

    constructor(idMinisterio?: number,
                nombre?: string,
                descripcion?: string) {
        this.idMinisterio = idMinisterio;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public static clone = (ministerio: MinisterioModel): MinisterioModel =>
        new MinisterioModel(
            ministerio.idMinisterio,
            ministerio.nombre,
            ministerio.descripcion)
}
