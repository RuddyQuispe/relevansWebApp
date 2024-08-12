import { UserModel } from './user.model';
import { ResponseHeaderModel } from '../responseHeader.model';

export class UserModelResponseList {
    public header: ResponseHeaderModel;
    public users: Array<UserModel>;
}
