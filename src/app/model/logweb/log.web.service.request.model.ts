import {RequestHeaderModel} from '@app/model/requestHeader.model';
import {LogWebServiceModel} from '@models/logweb';

export class LogWebServiceRequestModel {
    header: RequestHeaderModel;
    logService: LogWebServiceModel;

    constructor(header: RequestHeaderModel, logService: LogWebServiceModel) {
        this.header = header;
        this.logService = logService;
    }
}

