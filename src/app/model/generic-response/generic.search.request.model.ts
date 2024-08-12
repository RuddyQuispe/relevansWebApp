import {SEARCH_TYPE} from '@app/utils/constants';

export class GenericSearchRequestModel {
    public codigo?: number;
    public descripcion?: string;
    public codParametro?: SEARCH_TYPE;
    public orderBy: string;
    public direction: string;
    public page: number;
    public pageSize: number;

    public static NAME_CODE_COLUMN: string = 'codigo';

    constructor(codigo?: number,
                descripcion?: string,
                codParametro?: SEARCH_TYPE,
                orderBy?: string,
                direction?: string,
                page?: number,
                pageSize?: number) {
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.codParametro = codParametro;
        this.orderBy = orderBy;
        this.direction = direction;
        this.page = page;
        this.pageSize = pageSize;
    }

    public clone = (): GenericSearchRequestModel =>
        new GenericSearchRequestModel(
            this.codigo,
            this.descripcion,
            this.codParametro,
            this.orderBy,
            this.direction,
            this.page,
            this.pageSize)
}
