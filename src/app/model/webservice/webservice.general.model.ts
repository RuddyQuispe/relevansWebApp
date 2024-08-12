export class WebserviceGeneralModel {

    constructor(
        public code?: string,
        public reference?: string,
        public url?: string,
        public namespace?: string,
        public servicename?: string,
        public connectTimeout?: number,
        public callTimeout?: number,
        public maxRetry?: number,
        public enabled?: boolean,
        public lastUser?: string,
        public lastTime?: Date,
        public companyId?: number,
        public webserviceId?: number,
        public companyWebserviceId?: number
    ) {
    }

    public clone(): WebserviceGeneralModel {
        const webservice: WebserviceGeneralModel = new WebserviceGeneralModel();
        webservice.code = this.code;
        webservice.reference = this.reference;
        webservice.url = this.url;
        webservice.namespace = this.namespace;
        webservice.servicename = this.servicename;
        webservice.connectTimeout = this.connectTimeout;
        webservice.callTimeout = this.callTimeout;
        webservice.maxRetry = this.maxRetry;
        webservice.enabled = this.enabled;
        webservice.lastUser = this.lastUser;
        webservice.lastTime = this.lastTime;
        webservice.webserviceId = this.webserviceId;
        webservice.companyId = this.companyId;
        webservice.companyWebserviceId = this.companyWebserviceId;
        return webservice;
    }
}
