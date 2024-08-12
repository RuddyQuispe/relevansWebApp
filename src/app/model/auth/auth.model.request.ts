import {RequestHeaderModel} from '@app/model/requestHeader.model';

export class AuthModelRequest {
    header: RequestHeaderModel;
    password: string;
    constructor(header: RequestHeaderModel, password?: string) {
        this.header = header;
        this.password = password;
    }
}
