import { RequestHeaderModel } from '../requestHeader.model';
import { DomainModel } from './domain.model';

export class DomainModelResponseList {
    public header: RequestHeaderModel;
    public domains: Array<DomainModel>;
}
