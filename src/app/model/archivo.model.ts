export class ArchivoModel {
    public base64: string;
    public nombreArchivo: string;


    constructor(base64?: string,
                nombreArchivo?: string) {
        this.base64 = base64;
        this.nombreArchivo = nombreArchivo;
    }
}
