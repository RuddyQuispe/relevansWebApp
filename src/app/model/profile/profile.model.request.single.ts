import {RequestHeaderModel} from '@app/model/requestHeader.model';
import {ProfileModel} from '@app/model/profile/profile.model';

export class ProfileModelRequestSingle {
    header: RequestHeaderModel;
    profile: ProfileModel;
    constructor(header: RequestHeaderModel, profileDto: ProfileModel) {
        this.header = header;
        this.profile = profileDto;
    }
}

