import {RequestHeaderModel} from '@app/model/requestHeader.model';
import {PrivkeyModel} from '@app/model/privkey/privkey.model';

export class PrivkeyModelRequest {
    header: RequestHeaderModel;
    privkey: PrivkeyModel;
    constructor(header: RequestHeaderModel, privkeyDto: PrivkeyModel) {
        this.header = header;
        this.privkey = privkeyDto;
    }
}

