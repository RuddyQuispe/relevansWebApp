import {RequestHeaderModel} from '../requestHeader.model';

export class ValidModel1 {
    header: RequestHeaderModel;
    ruta: string;
    constructor(header: RequestHeaderModel, ruta: string) {
        this.header = header;
        this.ruta = ruta;
    }
}
