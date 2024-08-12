export class QueryModel {
    public queryId: number;
    public code: string;
    public description: string;
    public definition: string;
    public parameter: string;
    public lastUser: string;
    public lastTime: string;
    public sortField: string;
    public sortSense: string;
    public first: number;
    public pageSize: number;
    public totalRows: number;


    constructor(queryId?: number,
                code?: string,
                description?: string,
                definition?: string,
                parameter?: string,
                lastUser?: string,
                lastTime?: string) {
        this.queryId = queryId;
        this.code = code;
        this.description = description;
        this.definition = definition;
        this.parameter = parameter;
        this.lastUser = lastUser;
        this.lastTime = lastTime;
    }

    clone(c: QueryModel): QueryModel {
        const model: QueryModel = new QueryModel();
        model.queryId = c.queryId;
        model.code = c.code;
        model.description = c.description;
        model.definition = c.definition;
        model.parameter = c.parameter;
        model.lastUser = c.lastUser;
        model.lastTime = c.lastTime;
        return model;
    }
}
