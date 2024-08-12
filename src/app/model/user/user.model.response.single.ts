import { UserModel } from './user.model';
import { ResponseHeaderModel } from '../responseHeader.model';

export class UserModelResponseSingle {
    public header: ResponseHeaderModel;
    public user: UserModel;
}
