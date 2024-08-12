import { RequestHeaderModel } from '@app/model/requestHeader.model';
import { QueryModel } from '@app/model/query/query.model';

export class QueryModelRequestSingle {
    public header: RequestHeaderModel;
    public query: QueryModel;
    constructor(header: RequestHeaderModel, query: QueryModel) {
        this.header = header;
        this.query = query;
    }
}

