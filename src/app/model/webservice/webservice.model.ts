export class WebServiceModel {
    public webserviceId: number;
    public code: string;
    public reference: string;
    public enabled: boolean;
    public lastUser: string;
    public lastTime: Date;


    constructor(webserviceId?: number,
                code?: string,
                reference?: string,
                enabled?: boolean,
                lastUser?: string,
                lastTime?: Date) {
        this.webserviceId = webserviceId;
        this.code = code;
        this.reference = reference;
        this.enabled = enabled;
        this.lastUser = lastUser;
        this.lastTime = lastTime;
    }

    public clone(): WebServiceModel {
        const webservice: WebServiceModel = new WebServiceModel();
        webservice.webserviceId = this.webserviceId;
        webservice.code = this.code;
        webservice.reference = this.reference;
        webservice.enabled = this.enabled;
        webservice.lastUser = this.lastUser;
        webservice.lastTime = this.lastTime;
        return webservice;
    }
}
