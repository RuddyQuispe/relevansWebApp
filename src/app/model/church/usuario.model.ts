import {MinisterioModel} from '@models/church';

export class UsuarioModel {
    public idUser: number;
    public email: string;
    public idDevice: string;
    public password: string;
    public username: string;
    public ministerios: Array<MinisterioModel>;


    constructor(idUser?: number,
                email?: string,
                idDevice?: string,
                password?: string,
                username?: string,
                ministerios?: Array<MinisterioModel>) {
        this.idUser = idUser;
        this.email = email;
        this.idDevice = idDevice;
        this.password = password;
        this.username = username;
        this.ministerios = ministerios ?? [];
    }

    public static clone = (usuario: UsuarioModel): UsuarioModel =>
        new UsuarioModel(
            usuario.idUser,
            usuario.email,
            usuario.idDevice,
            usuario.password,
            usuario.username,
            usuario.ministerios)
}
