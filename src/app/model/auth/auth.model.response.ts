import {ResponseHeaderModel} from '@models/responseHeader.model';
import {AccessModel} from '@models/access';

export class AuthModelResponse {
    header: ResponseHeaderModel;
    userId: number;
    name: string;
    jwtToken: string;
    language: string;
    companyId: string;
    rol: string;
    menu: AccessModel[];
}
