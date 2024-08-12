import { DomainModel } from './domain.model';
import { ResponseHeaderModel } from '../responseHeader.model';

export class DomainModelResponseSingle {
    public header: ResponseHeaderModel;
    public domainDto: DomainModel;

    constructor(header: ResponseHeaderModel, domainDto: DomainModel) {
        this.header = header;
        this.domainDto = domainDto;
    }
}
