import {AccessModel} from '@models/access';

export class ProfileModel {
    profileId: number;
    name: string;
    description: string;
    dashboard: boolean;
    enabled: boolean;
    list: AccessModel[];

    clone(c: ProfileModel): ProfileModel {
        const model: ProfileModel = new ProfileModel();
        model.profileId = c.profileId;
        model.name = c.name;
        model.description = c.description;
        model.dashboard = c.dashboard;
        model.enabled = c.enabled;
        model.list = c.list;
        return model;
    }
}
