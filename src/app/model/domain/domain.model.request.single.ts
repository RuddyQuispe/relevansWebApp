import {RequestHeaderModel} from '../requestHeader.model';
import {DomainModel} from './domain.model';

export class DomainModelRequestSingle {
    public header: RequestHeaderModel;
    public domain: DomainModel;

    constructor(header: RequestHeaderModel, domain: DomainModel) {
        this.header = header;
        this.domain = domain;
    }
}
