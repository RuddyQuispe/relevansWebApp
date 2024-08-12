import {AccessModel} from './access.model';
import {ResponseHeaderModel} from '../responseHeader.model';

export class AccessModelResponse {
    header: ResponseHeaderModel;
    list: AccessModel[];
}
