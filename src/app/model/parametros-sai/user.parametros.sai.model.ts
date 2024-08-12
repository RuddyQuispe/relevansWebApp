import {UserDatosAdicionalesModel} from '@models/unidad-negocio';

export class UserParametrosSaiModel {
    public codigoUsuarioSai: number;
    public userParametrosSaiId: number;
    // public tipoCxC: number;
    public aplicacionCxC: number;
    public tipoCxP: number;
    public aplicacionCxP: number;
    public viaCobroxDescuento: number;
    public viaPagoxConsumo: number;
    public viaPagoxCastigo: number;
    public usuarioId: number;
    public perfilAutorizadorId: string;

    public codigoUsuarioSaiDesc: string;
    // public tipoCxCDesc: string;
    public aplicacionCxCDesc: string;
    public tipoCxPDesc: string;
    public aplicacionCxPDesc: string;
    public viaCobroxDescuentoDesc: string;
    public viaPagoxConsumoDesc: string;
    public viaPagoxCastigoDesc: string;
    public userUnidadNegocioDtoList: Array<UserDatosAdicionalesModel>;
    public tipoCxCDtoList: Array<UserDatosAdicionalesModel>;

    public usuarioIdDesc: string;


    constructor(codigoUsuarioSai?: number,
                userParametrosSaiId?: number,
                // tipoCxC?: number,
                aplicacionCxC?: number,
                tipoCxP?: number,
                aplicacionCxP?: number,
                viaCobroxDescuento?: number,
                viaPagoxConsumo?: number,
                viaPagoxCastigo?: number,
                usuarioId?: number,
                userUnidadNegocioDtoList?: Array<UserDatosAdicionalesModel>,
                tipoCxCDtoList?: Array<UserDatosAdicionalesModel>,
                codigoUsuarioSaiDesc?: string,
                // tipoCxCDesc?: string,
                aplicacionCxCDesc?: string,
                tipoCxPDesc?: string,
                aplicacionCxPDesc?: string,
                viaCobroxDescuentoDesc?: string,
                viaPagoxConsumoDesc?: string,
                viaPagoxCastigoDesc?: string,
                perfilAutorizadorId?: string) {
        this.codigoUsuarioSai = codigoUsuarioSai;
        this.userParametrosSaiId = userParametrosSaiId;
        // this.tipoCxC = tipoCxC;
        this.aplicacionCxC = aplicacionCxC;
        this.tipoCxP = tipoCxP;
        this.aplicacionCxP = aplicacionCxP;
        this.viaCobroxDescuento = viaCobroxDescuento;
        this.viaPagoxConsumo = viaPagoxConsumo;
        this.viaPagoxCastigo = viaPagoxCastigo;
        this.usuarioId = usuarioId;
        this.userUnidadNegocioDtoList = userUnidadNegocioDtoList || [];
        this.tipoCxCDtoList = tipoCxCDtoList || [];
        this.codigoUsuarioSaiDesc = codigoUsuarioSaiDesc;
        // this.tipoCxCDesc = tipoCxCDesc;
        this.aplicacionCxCDesc = aplicacionCxCDesc;
        this.tipoCxPDesc = tipoCxPDesc;
        this.aplicacionCxPDesc = aplicacionCxPDesc;
        this.viaCobroxDescuentoDesc = viaCobroxDescuentoDesc;
        this.viaPagoxConsumoDesc = viaPagoxConsumoDesc;
        this.viaPagoxCastigoDesc = viaPagoxCastigoDesc;
        this.usuarioIdDesc = '';

        this.perfilAutorizadorId = perfilAutorizadorId;
    }

    public static clone = (saiParametersModel: UserParametrosSaiModel): UserParametrosSaiModel =>
        new UserParametrosSaiModel(
            saiParametersModel.codigoUsuarioSai,
            saiParametersModel.userParametrosSaiId,
            // saiParametersModel.tipoCxC,
            saiParametersModel.aplicacionCxC,
            saiParametersModel.tipoCxP,
            saiParametersModel.aplicacionCxP,
            saiParametersModel.viaCobroxDescuento,
            saiParametersModel.viaPagoxConsumo,
            saiParametersModel.viaPagoxCastigo,
            saiParametersModel.usuarioId,
            saiParametersModel.userUnidadNegocioDtoList,
            saiParametersModel.tipoCxCDtoList,
            saiParametersModel.codigoUsuarioSaiDesc,
            // saiParametersModel.tipoCxCDesc,
            saiParametersModel.aplicacionCxCDesc,
            saiParametersModel.tipoCxPDesc,
            saiParametersModel.aplicacionCxPDesc,
            saiParametersModel.viaCobroxDescuentoDesc,
            saiParametersModel.viaPagoxConsumoDesc,
            saiParametersModel.viaPagoxCastigoDesc,
            saiParametersModel.perfilAutorizadorId
        )
}
