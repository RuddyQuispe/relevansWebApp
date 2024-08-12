export class LogWebServiceModel {
    public serviceId: number;
    public companyId: number;
    public idSession: string;  // filter
    public appRequest: string; // filter
    public message: string;
    public type: string;
    public requestDate: Date;
    public responseCode: string;
    public responseDescription: string;
    public responseDate: Date;
    public ipRequest: string;
    public request: string;   // filter
    public response: string;  // filter
    // Filters
    public beginDate: Date;   // filter
    public endDate: Date;     // filter
    // Lazy
    public sortField: string;
    public sortSense: string;
    public first: number;
    public pageSize: number;


    constructor(companyId?: number,
                serviceId?: number,
                idSession?: string,
                appRequest?: string,
                message?: string,
                type?: string,
                requestDate?: Date,
                responseCode?: string,
                responseDescription?: string,
                responseDate?: Date,
                ipRequest?: string,
                request?: string,
                response?: string,
                beginDate?: Date,
                endDate?: Date,
                sortField?: string,
                sortSense?: string,
                first?: number,
                pageSize?: number) {
        this.serviceId = serviceId;
        this.companyId = companyId;
        this.idSession = idSession;
        this.appRequest = appRequest;
        this.message = message;
        this.type = type;
        this.requestDate = requestDate;
        this.responseCode = responseCode;
        this.responseDescription = responseDescription;
        this.responseDate = responseDate;
        this.ipRequest = ipRequest;
        this.request = request;
        this.response = response;
        this.beginDate = beginDate;
        this.endDate = endDate;
        this.sortField = sortField;
        this.sortSense = sortSense;
        this.first = first;
        this.pageSize = pageSize;
    }

    public static clone = (logServiceModel: LogWebServiceModel) =>
        new LogWebServiceModel(
            logServiceModel.companyId ?? null,
            logServiceModel.serviceId ?? null,
            logServiceModel.idSession ?? null,
            !logServiceModel.appRequest || logServiceModel.appRequest == '' ? null : logServiceModel.appRequest,
            logServiceModel.message ?? null,
            logServiceModel.type ?? null,
            logServiceModel.requestDate ?? null,
            logServiceModel.responseCode ?? null,
            logServiceModel.responseDescription ?? null,
            logServiceModel.responseDate ?? null,
            !logServiceModel.ipRequest || logServiceModel.ipRequest == '' ? null : logServiceModel.ipRequest,
            logServiceModel.request ?? null,
            logServiceModel.response ?? null,
            logServiceModel.beginDate ?? null,
            logServiceModel.endDate ?? null,
            logServiceModel.sortField ?? null,
            logServiceModel.sortSense ?? null,
            logServiceModel.first ?? null,
            logServiceModel.pageSize ?? null
        );
}
