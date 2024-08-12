export class FilterModel {
    public first = 0;
    public rows: number;
    public field: string;
    public sortOrder: string;

    constructor(first?: number, rows?: number, field?: string, sortOrder?: string) {
        this.first = first;
        this.rows = rows;
        this.field = field;
        this.sortOrder = sortOrder;
    }

    public getTipOrder(order: number) {
        if (order === null || order === undefined) {
            return'ASC';
        }
        return order > 0 ? 'ASC' : 'DESC';
    }
}
