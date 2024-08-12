export class VentaParametroSaiModel {
    public ventaParametroSaiId: number;
    public codigoUsuarioSai: number;
    public tipoCxC: any;
    public aplicacionCxC: number;
    public tipoCxP: number;
    public aplicacionCxP: number;
    public viaCobroxDescuento: number;
    public viaPagoxConsumo: number;
    public viaPagoxCastigo: number;
    public unidadNegocio: any;
    public ventaId: number;


    public codigoUsuarioSaiDesc: string;
    public tipoCxCDesc: string;
    public aplicacionCxCDesc: string;
    public tipoCxPDesc: string;
    public aplicacionCxPDesc: string;
    public viaCobroxDescuentoDesc: string;
    public viaPagoxConsumoDesc: string;
    public viaPagoxCastigoDesc: string;
    public unidadNegocioDesc: string;


    constructor(ventaParametroSaiId?: number,
                codigoUsuarioSai?: number,
                tipoCxC?: number,
                aplicacionCxC?: number,
                tipoCxP?: number,
                aplicacionCxP?: number,
                viaCobroxDescuento?: number,
                viaPagoxConsumo?: number,
                viaPagoxCastigo?: number,
                unidadNegocio?: number,
                ventaId?: number,
                codigoUsuarioSaiDesc?: string,
                tipoCxCDesc?: string,
                aplicacionCxCDesc?: string,
                tipoCxPDesc?: string,
                aplicacionCxPDesc?: string,
                viaCobroxDescuentoDesc?: string,
                viaPagoxConsumoDesc?: string,
                viaPagoxCastigoDesc?: string,
                unidadNegocioDesc?: string) {
        this.ventaParametroSaiId = ventaParametroSaiId;
        this.codigoUsuarioSai = codigoUsuarioSai;
        this.tipoCxC = tipoCxC;
        this.aplicacionCxC = aplicacionCxC;
        this.tipoCxP = tipoCxP;
        this.aplicacionCxP = aplicacionCxP;
        this.viaCobroxDescuento = viaCobroxDescuento;
        this.viaPagoxConsumo = viaPagoxConsumo;
        this.viaPagoxCastigo = viaPagoxCastigo;
        this.unidadNegocio = unidadNegocio;
        this.ventaId = ventaId;
        this.codigoUsuarioSaiDesc = codigoUsuarioSaiDesc;
        this.tipoCxCDesc = tipoCxCDesc;
        this.aplicacionCxCDesc = aplicacionCxCDesc;
        this.tipoCxPDesc = tipoCxPDesc;
        this.aplicacionCxPDesc = aplicacionCxPDesc;
        this.viaCobroxDescuentoDesc = viaCobroxDescuentoDesc;
        this.viaPagoxConsumoDesc = viaPagoxConsumoDesc;
        this.viaPagoxCastigoDesc = viaPagoxCastigoDesc;
        this.unidadNegocioDesc = unidadNegocioDesc;
    }
}
