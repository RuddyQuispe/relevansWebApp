export class ValeFraccionadoModel {
    public beneficiario: string;
    public importe: number;


    constructor(beneficiario?: string,
                importe?: number) {
        this.beneficiario = beneficiario;
        this.importe = importe;
    }
}