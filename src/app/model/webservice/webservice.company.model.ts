export class WebserviceCompanyModel {
    public companyWebserviceId: number;
    public webserviceId: number;
    public companyId: number;
    public url: string;
    public namespace: string;
    public serviceName: string;
    public connectTimeout: number;
    public callTimeout: number;
    public maxRetry: number;
    public enabled: boolean;
    public lastUser: string;
    public lastTime: Date;

    public static clone(model: WebserviceCompanyModel) {
        const result: WebserviceCompanyModel = new WebserviceCompanyModel();
        result.companyWebserviceId = model.companyWebserviceId;
        result.webserviceId = model.webserviceId;
        result.companyId = model.companyId;
        result.url = model.url;
        result.namespace = model.namespace;
        result.serviceName = model.serviceName;
        result.connectTimeout = model.connectTimeout;
        result.callTimeout = model.callTimeout;
        result.maxRetry = model.maxRetry;
        result.enabled = model.enabled;
        result.lastUser = model.lastUser;
        result.lastTime = model.lastTime;
        return result;
    }
}