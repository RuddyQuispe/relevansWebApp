import {ResponseHeaderModel} from '@app/model/responseHeader.model';
import {PrivkeyModel} from '@app/model/privkey/privkey.model';

export class PrivkeyModelResponseList {
    header: ResponseHeaderModel;
    privkeys: PrivkeyModel[];
}
