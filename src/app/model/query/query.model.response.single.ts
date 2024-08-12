import { QueryModel } from '@app/model/query/query.model';
import { ResponseHeaderModel } from '@app/model/responseHeader.model';

export class QueryModelResponseSingle {
    public header: ResponseHeaderModel;
    public query: QueryModel;
}
