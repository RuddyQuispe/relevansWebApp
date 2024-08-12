import {RequestHeaderModel} from '@app/model/requestHeader.model';
import {WebServiceModel} from './webservice.model';
import {WebserviceCompanyModel} from '@models/webservice/webservice.company.model';

export class WebServiceModelRequestSingle {
    header: RequestHeaderModel;
    webService: WebServiceModel;
    webServiceParametrization: WebserviceCompanyModel;

    constructor(header?: RequestHeaderModel, webService?: WebServiceModel, webServiceParametrization?: WebserviceCompanyModel) {
        this.header = header;
        this.webService = webService;
        this.webServiceParametrization = webServiceParametrization;
    }
}
