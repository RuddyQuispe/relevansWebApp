export class MenuApiFilterModel {
    public nombre: string;
    public orderBy: string;
    public direction: string;
    public page: number;
    public pageSize: number;


    constructor(orderBy?: string,
                direction?: string,
                page?: number,
                pageSize?: number,
                nombre?: string) {
        this.nombre = nombre;
        this.orderBy = orderBy;
        this.direction = direction;
        this.page = page;
        this.pageSize = pageSize;
    }

    public static clone = (menuFilterModel: MenuApiFilterModel) =>
        new MenuApiFilterModel(
            menuFilterModel.orderBy,
            menuFilterModel.direction,
            menuFilterModel.page,
            menuFilterModel.pageSize,
            menuFilterModel.nombre)
}