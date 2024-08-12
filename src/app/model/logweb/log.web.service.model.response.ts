import {ResponseHeaderModel} from '@models/responseHeader.model';
import {LazyListResponseModel, LogWebServiceModel} from '@models/logweb';

export class LogWebServiceModelResponse {
    header: ResponseHeaderModel;
    logServices: LazyListResponseModel;
}
