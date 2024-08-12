import {VERSION} from '../../environments/version';

export class RequestHeaderModel {
    // public appVersion: string = VERSION.hash;
    // public token: string = null;
    public user: string;

    constructor(user: string) {
        this.user = user;
    }
}
