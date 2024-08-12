import {ConsumoValeModel} from "@models/vale/consumo.vale.model";

export class ValeModel {
    public static PROPERTY_VALE_ID: string = 'valeId';
    public valeId: number;
    public ventaId: number;
    public corteId: number;
    public identificadorQR: string;
    public fechaEmision: string;
    public fechaVigencia: string;
    public beneficiario: string;
    public empresa: string;
    public monto: number;
    public estado: string;
    public moneda: string;

    public fechaEmisionDate: Date;
    public fechaVigenciaDate: Date;
    public consumoDto: ConsumoValeModel;


    constructor(valeId?: number,
                beneficiario?: string,
                corteId?: number,
                empresa?: string,
                estado?: string,
                fechaEmision?: string,
                fechaVigencia?: string,
                identificadorQR?: string,
                monto?: number,
                ventaId?: number,
                moneda?: string) {
        this.valeId = valeId;
        this.beneficiario = beneficiario;
        this.corteId = corteId;
        this.empresa = empresa;
        this.estado = estado;
        this.fechaEmision = fechaEmision ?? new Date().toString();
        this.fechaVigencia = fechaVigencia ?? new Date().toString();
        this.identificadorQR = identificadorQR;
        this.monto = monto;
        this.ventaId = ventaId;
        this.fechaVigenciaDate = new Date(this.fechaVigencia);
        this.fechaEmisionDate = new Date(this.fechaEmision);
        this.moneda = moneda;
    }

    public static clone = (voucherModel: ValeModel): ValeModel =>
        new ValeModel(
            voucherModel.valeId,
            voucherModel.beneficiario,
            voucherModel.corteId,
            voucherModel.empresa,
            voucherModel.estado,
            voucherModel.fechaEmision,
            voucherModel.fechaVigencia,
            voucherModel.identificadorQR,
            voucherModel.monto,
            voucherModel.ventaId,
            voucherModel.moneda
        )
}


