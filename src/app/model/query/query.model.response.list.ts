import { QueryModel } from '@app/model/query/query.model';
import { ResponseHeaderModel } from '@app/model/responseHeader.model';

export class QueryModelResponseList {
    public header: ResponseHeaderModel;
    public queries: QueryModel[];
}
