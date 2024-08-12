import {RequestHeaderModel} from '@models/requestHeader.model';
import {ProfileModel} from '@models/profile/profile.model';

export class ProfileModelRequestList {
    header: RequestHeaderModel;
    profile: ProfileModel;
    constructor(header: RequestHeaderModel, profile: ProfileModel) {
        this.header = header;
        this.profile = profile;
    }
}
