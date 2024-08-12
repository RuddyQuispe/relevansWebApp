import {RequestHeaderModel} from '../requestHeader.model';
import {AccessModel} from './access.model';

export class AccessModelRequest {
    header: RequestHeaderModel;
    accessDto: AccessModel;
    constructor(header: RequestHeaderModel, accessDto: AccessModel) {
        this.header = header;
        this.accessDto = accessDto;
    }
}

