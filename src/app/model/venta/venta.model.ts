import {CorteValeModel} from '@models/corte-vale/corte.vale.model';
import {TYPE_CORPORATIVE_SALE, TYPE_PAYMENT_SALE} from '@app/utils/constants';
import {VentaParametroSaiModel} from 'app/model/parametros-sai';

export class VentaModel {

    public static PROPERTY_VENTA_ID: string = 'ventaId';

    public ventaId: number;

    // public unidadNegocio: any;
    // public tipoCxC: any;
    public fechaEmision: string;

    public clienteCodigo: number;
    public clienteNombre: string;
    public clienteNit: string;
    public clienteRazonSocial: string;
    public clienteComplemento: string;
    public clienteTipoDocumento: string;
    public clienteExtension: string;
    public formaPago: string;
    public formaPagoPlazo: number;
    public descuentoTipo: string;
    public descuentoValor: number;
    public fechaEntrega: string;
    public retenerFactura: boolean;
    public vigenciaVales: number;
    public moneda: string;
    public contratoVigencia: string;
    public contratoNumero: string;
    public clienteContacto: string;
    public clienteTelefono: string;
    public estado: string;
    public glosa: string;
    public corteVale: Array<CorteValeModel>;
    public parametroSaiDto: VentaParametroSaiModel;
    public descuentoFormaAplicacion: string;
    public usuarioVenta: number;
    public tipoVentaCorporativa: string;

    public totalPagar: number;
    public totalVenta: number;
    public totalDescuento: number;

    public fechaEmisionDate: Date;
    public fechaEntregaDate: Date;


    constructor(ventaId?: number,
                // unidadNegocio?: number,
                // tipoCxC?: number,
                fechaEmision?: string,
                clienteCodigo?: number,
                clienteNombre?: string,
                clienteNit?: string,
                clienteRazonSocial?: string,
                clienteComplemento?: string,
                clienteTipoDocumento?: string,
                clienteExtension?: string,
                formaPago?: string,
                formaPagoPlazo?: number,
                descuentoTipo?: string,
                descuentoValor?: number,
                fechaEntrega?: string,
                retenerFactura?: boolean,
                vigenciaVales?: number,
                moneda?: string,
                contratoVigencia?: string,
                contratoNumero?: string,
                clienteContacto?: string,
                clienteTelefono?: string,
                estado?: string,
                glosa?: string,
                corteVale?: Array<CorteValeModel>,
                parametroSaiDto?: VentaParametroSaiModel,
                descuentoFormaAplicacion?: string,
                usuarioVenta?: number,
                tipoVentaCorporativa?: string,
                totalPagar?: number,
                totalVenta?: number,
                totalDescuento?: number) {
        this.ventaId = ventaId ?? 0;
        // this.unidadNegocio = unidadNegocio;
        // this.tipoCxC = tipoCxC;
        this.fechaEmision = fechaEmision ?? new Date().toString();
        this.clienteCodigo = clienteCodigo;
        this.clienteNombre = clienteNombre;
        this.clienteNit = clienteNit;
        this.clienteRazonSocial = clienteRazonSocial;
        this.clienteComplemento = clienteComplemento;
        this.clienteTipoDocumento = clienteTipoDocumento;
        this.clienteExtension = clienteExtension;
        this.formaPago = formaPago ?? TYPE_PAYMENT_SALE.CREDIT;
        this.formaPagoPlazo = formaPagoPlazo ?? 0;
        this.descuentoTipo = descuentoTipo;
        this.descuentoValor = descuentoValor ?? 0;
        this.fechaEntrega = fechaEntrega;
        this.retenerFactura = retenerFactura ?? false;
        this.vigenciaVales = vigenciaVales ?? 0;
        this.moneda = moneda;
        this.contratoVigencia = contratoVigencia;
        this.contratoNumero = contratoNumero;
        this.clienteContacto = clienteContacto;
        this.clienteTelefono = clienteTelefono;
        this.estado = estado;
        this.glosa = glosa ?? '';
        this.corteVale = corteVale ?? [];
        this.parametroSaiDto = parametroSaiDto ?? new VentaParametroSaiModel();
        this.descuentoFormaAplicacion = descuentoFormaAplicacion;
        this.usuarioVenta = usuarioVenta;
        this.tipoVentaCorporativa = tipoVentaCorporativa ?? TYPE_CORPORATIVE_SALE.AL_PORTADOR;
        this.totalVenta = totalVenta ?? 0;
        this.totalDescuento = totalDescuento ?? 0;
        this.totalPagar = totalPagar ?? this.totalVenta - this.totalDescuento;
        this.fechaEmisionDate = fechaEmision ? new Date(fechaEmision) : new Date();
        this.fechaEntregaDate = fechaEntrega ? new Date(fechaEntrega) : new Date();
    }

// constructor(ventaId?: number, fechaEmision?: string, clienteCodigo?: number, unidadNegocio?: number,
    //             clienteNit?: string, clienteRazonSocial?: string, formaPago?: string, formaPagoPlazo?: number,
    //             descuentoTipo?: string, descuentoValor?: number, fechaEntrega?: string, retenerFactura?: boolean,
    //             vigenciaVales?: number, importe?: number, moneda?: number, contratoVigencia?: string, contratoNumero?: string,
    //             descuentoFormaAplicacion?: string, clienteContacto?: string, clienteTelefono?: string, glosa?: string,
    //             clienteNombre?: string, usuarioVenta?: number, clienteComplemento?: string, corteVale?: Array<CorteValeModel>,
    //             parametroSaiDto?: VentaParametroSaiModel) {
    //     this.ventaId = ventaId || 0;
    //     this.fechaEmision = fechaEmision || new Date().toString();
    //     this.clienteCodigo = clienteCodigo || null;
    //     this.unidadNegocio = unidadNegocio;
    //     this.clienteNit = clienteNit || '';
    //     this.clienteRazonSocial = clienteRazonSocial || '';
    //     this.clienteComplemento = clienteComplemento;
    //     this.formaPago = formaPago || '';
    //     this.formaPagoPlazo = formaPagoPlazo || 0;
    //     this.descuentoTipo = descuentoTipo || '';
    //     this.descuentoValor = descuentoValor || 0;
    //     this.fechaEntrega = fechaEntrega || new Date().toString();
    //     this.retenerFactura = retenerFactura || false;
    //     this.vigenciaVales = vigenciaVales || 0;
    //     this.totalPagar = importe || 0;
    //     this.moneda = moneda || TIPO_MONEDA.BOLIVIANDOS;
    //     this.contratoVigencia = contratoVigencia || '';
    //     this.contratoNumero = contratoNumero || '';
    //     this.clienteContacto = clienteContacto || '';
    //     this.clienteTelefono = clienteTelefono || '';
    //     this.glosa = glosa || '';
    //     this.clienteNombre = clienteNombre;
    //     this.descuentoFormaAplicacion = descuentoFormaAplicacion || '';
    //     this.corteVale = corteVale || [];
    //     this.parametroSaiDto = parametroSaiDto;
    //     this.usuarioVenta = usuarioVenta;
    //     this.fechaEmisionDate = fechaEmision ? new Date(fechaEmision) : new Date();
    //     this.fechaEntregaDate = fechaEntrega ? new Date(fechaEntrega) : new Date();
    //     this.parametroSaiDto = new VentaParametroSaiModel();
    // }


    public static clone(sale: VentaModel): VentaModel {
        return new VentaModel(
            sale.ventaId,
            // sale.unidadNegocio,
            // sale.tipoCxC,
            sale.fechaEmision,
            sale.clienteCodigo,
            sale.clienteNombre,
            sale.clienteNit,
            sale.clienteRazonSocial,
            sale.clienteComplemento,
            sale.clienteTipoDocumento,
            sale.clienteExtension,
            sale.formaPago,
            sale.formaPagoPlazo,
            sale.descuentoTipo,
            sale.descuentoValor,
            sale.fechaEntrega,
            sale.retenerFactura,
            sale.vigenciaVales,
            sale.moneda,
            sale.contratoVigencia,
            sale.contratoNumero || '',
            sale.clienteContacto,
            sale.clienteTelefono,
            sale.estado,
            sale.glosa,
            sale.corteVale,
            sale.parametroSaiDto,
            sale.descuentoFormaAplicacion,
            sale.usuarioVenta,
            sale.tipoVentaCorporativa,
            sale.totalPagar,
            sale.totalVenta,
            sale.totalDescuento,
        );
    }
}
