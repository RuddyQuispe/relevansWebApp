import {ValeFraccionadoModel} from '@models/vale';

export class ValeFraccionamientoRequestModel {
    public valeId: number;
    public valeList: Array<ValeFraccionadoModel>;


    constructor(valeId?: number,
                valeList?: Array<ValeFraccionadoModel>) {
        this.valeId = valeId;
        this.valeList = valeList;
    }
}
