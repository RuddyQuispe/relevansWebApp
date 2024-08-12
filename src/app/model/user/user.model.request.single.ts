import { RequestHeaderModel } from '../requestHeader.model';
import { UserModel } from './user.model';

export class UserModelRequestSingle {
    public header: RequestHeaderModel;
    public user: UserModel;
    constructor(header: RequestHeaderModel, user: UserModel) {
        this.header = header;
        this.user = user;
    }
}

