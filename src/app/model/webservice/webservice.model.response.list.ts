import { ResponseHeaderModel } from '../responseHeader.model';
import { WebServiceModel } from './webservice.model';
import {WebserviceCompanyModel} from '@models/webservice/webservice.company.model';

export class WebServiceModelResponseList {
    public header: ResponseHeaderModel;
    public webServices: Array<WebServiceModel>;
    public webServicesParametrization: Array<WebserviceCompanyModel>;
}
