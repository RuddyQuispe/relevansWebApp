import {ResponseHeaderModel} from '@models/responseHeader.model';
import {ProfileModel} from '@models/profile/profile.model';

export class ProfileModelResponseList {
    header: ResponseHeaderModel;
    profiles: ProfileModel[];
}
