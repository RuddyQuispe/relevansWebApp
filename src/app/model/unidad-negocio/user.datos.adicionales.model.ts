export class UserDatosAdicionalesModel {
    public codigoSai: string;
    public descripcion: string;
    public userDatosAdicionalesId: number;
    public usuarioId: number;
    private tipo: string;

    constructor(codigoSai?: string,
                descripcion?: string,
                userUnidadNegocioId?: number,
                usuarioId?: number,
                tipo?: string) {
        this.codigoSai = codigoSai;
        this.descripcion = descripcion;
        this.userDatosAdicionalesId = userUnidadNegocioId;
        this.usuarioId = usuarioId;
        this.tipo = tipo;
    }

    public static clone = (userDatosAdicionalesModel: UserDatosAdicionalesModel): UserDatosAdicionalesModel =>
        new UserDatosAdicionalesModel(
            userDatosAdicionalesModel.codigoSai,
            userDatosAdicionalesModel.descripcion,
            userDatosAdicionalesModel.userDatosAdicionalesId,
            userDatosAdicionalesModel.usuarioId,
            userDatosAdicionalesModel.tipo)
}