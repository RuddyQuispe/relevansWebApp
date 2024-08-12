import {RequestHeaderModel} from '@app/model/requestHeader.model';

export class D1 {
    header: RequestHeaderModel;
    fechaInicio: Date;
    fechaFin: Date;
    codigoBanco: string;
    sdf: string; // YYYY-MM-dd , YYYY-IW, YYYY-MM

    constructor(header?: RequestHeaderModel, fechaInicio?: Date, fechaFin?: Date, codigoBanco?: string) {
        this.header = header;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.codigoBanco = codigoBanco;
    }
}

