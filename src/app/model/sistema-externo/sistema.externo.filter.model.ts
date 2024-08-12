export class SistemaExternoFilterModel {
    public codigo: string;
    public orderBy: string;
    public direction: string;
    public page: number;
    public pageSize: number;


    constructor(codigo?: string, orderBy?: string, direction?: string, page?: number, pageSize?: number) {
        this.codigo = codigo;
        this.orderBy = orderBy;
        this.direction = direction;
        this.page = page;
        this.pageSize = pageSize;
    }
}