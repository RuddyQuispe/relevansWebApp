export class UserDatosAdicionalesByTypeModelRequest {

    public userId: number;
    public tipo: string;

    constructor(userId: number, tipo: string) {
        this.userId = userId;
        this.tipo = tipo;
    }
}