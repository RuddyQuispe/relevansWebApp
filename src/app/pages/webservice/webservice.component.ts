import {Component, OnInit} from '@angular/core';
import {WebServiceService} from '@services/template/web-service.service';
import {SelectItem} from 'primeng/api';
import {MensajeService} from '@app/error/mensaje.service';
import {AuthService} from '@services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {RequestHeaderModel} from '@app/model/requestHeader.model';
import {CONFIG} from '@config/config';
import {
    WebserviceCompanyModel, WebserviceGeneralModel,
    WebServiceModel,
    WebServiceModelRequestSingle,
    WebServiceModelResponseList,
    WebServiceModelResponseSingle
} from '@app/model/webservice';
import {forkJoin, Observable} from 'rxjs';

@Component({
    selector: 'app-webservice',
    templateUrl: './webservice.component.html'
})
export class WebserviceComponent implements OnInit {

    public list: Array<WebserviceGeneralModel> = [];
    public webServiceFilterModel: WebServiceModel;
    public webServiceModelToEdit: WebserviceGeneralModel;

    public cmpMin: string;
    public cmpReq: string;
    public rowsTables: number = Number(CONFIG.ROWS_TABLE);
    public status: SelectItem[] = [];
    public editDialog: boolean;
    public isView: boolean;
    public submitted = false;
    public loading = false;
    public sizeOrders: number;

    constructor(
        public webService: WebServiceService,
        private authService: AuthService,
        private translate: TranslateService,
        private messageService: MensajeService
    ) {
        this.webServiceFilterModel = new WebServiceModel();
    }

    ngOnInit() {
        this.cmpReq = this.translate.instant('cmpReq');
        this.cmpMin = this.translate.instant('cmpMin');
        this.status = [
            {label: this.translate.instant('yes'), value: true},
            {label: this.translate.instant('not'), value: false}
        ];
        this.onList();
    }

    public onList(): void {
        this.loading = true;
        this.webService.onCustomList(
            new WebServiceModelRequestSingle(new RequestHeaderModel(this.authService.getUser()),
                this.webServiceFilterModel)).subscribe({
            next: (data: WebServiceModelResponseList) => {
                this.list = [];
                data.webServices.forEach(w => {
                    const webServiceCompanyDetail: Array<WebserviceCompanyModel> = data.webServicesParametrization
                        .filter(wp => wp.webserviceId === w.webserviceId);
                    webServiceCompanyDetail.forEach((wp: WebserviceCompanyModel) => {
                        this.list.push(new WebserviceGeneralModel(
                            w.code,
                            w.reference,
                            wp.url,
                            wp.namespace,
                            wp.serviceName,
                            wp.connectTimeout,
                            wp.callTimeout,
                            wp.maxRetry,
                            wp.enabled,
                            wp.lastUser,
                            wp.lastTime,
                            wp.companyId,
                            w.webserviceId,
                            wp.companyWebserviceId
                        ));
                    });

                });
                this.loading = false;
            },
            error: error => this.loading = false
        });
    }

    showView(event: Event, webServiceModel: WebserviceGeneralModel) {
        this.webServiceModelToEdit = webServiceModel.clone();
        this.editDialog = true;
        this.isView = true;
        event.preventDefault();
    }

    showEdit(event: Event, webServiceModel: WebserviceGeneralModel) {
        this.webServiceModelToEdit = webServiceModel.clone();
        this.editDialog = true;
        this.isView = false;
        event.preventDefault();
    }

    public onSave(webServiceUpdatedOrNew: WebserviceGeneralModel): void {
        const webserviceGeneralModel: WebserviceGeneralModel = webServiceUpdatedOrNew.clone();
        this.submitted = true;
        const header: RequestHeaderModel = new RequestHeaderModel(this.authService.getUser());
        // mapping WebserviceGeneralModel to WebServiceModel and WebserviceCompanyModel
        const webServiceModel: WebServiceModel = new WebServiceModel();
        webServiceModel.webserviceId = webserviceGeneralModel.webserviceId;
        webServiceModel.enabled = webserviceGeneralModel.enabled;
        webServiceModel.reference = webserviceGeneralModel.reference;
        webServiceModel.code = webserviceGeneralModel.code;
        webServiceModel.lastUser = header.user;
        webServiceModel.lastTime = new Date();

        const webserviceCompanyModel: WebserviceCompanyModel = new WebserviceCompanyModel();
        webserviceCompanyModel.enabled = webserviceGeneralModel.enabled;
        webserviceCompanyModel.webserviceId = webserviceGeneralModel.webserviceId;
        webserviceCompanyModel.callTimeout = webserviceGeneralModel.callTimeout;
        webserviceCompanyModel.connectTimeout = webserviceGeneralModel.connectTimeout;
        webserviceCompanyModel.maxRetry = webserviceGeneralModel.maxRetry;
        webserviceCompanyModel.url = webserviceGeneralModel.url;
        webserviceCompanyModel.serviceName = webserviceGeneralModel.servicename;
        webserviceCompanyModel.companyWebserviceId = webserviceGeneralModel.companyWebserviceId;
        webserviceCompanyModel.lastUser = header.user;
        webserviceCompanyModel.lastTime = new Date();
        webserviceCompanyModel.companyId = webserviceGeneralModel.companyId;
        webserviceCompanyModel.namespace = webserviceGeneralModel.namespace;

        const webServiceRequest: WebServiceModelRequestSingle = new WebServiceModelRequestSingle(
            header, webServiceModel, webserviceCompanyModel);

        forkJoin([
            this.webService.onMergeCustomParameter(webServiceRequest),
            this.webService.onMerge(webServiceRequest)
        ]).subscribe({
            next: (response: Array<WebServiceModelResponseSingle>) => {
                this.submitted = false;
                this.editDialog = false;
                this.messageService.showSuccess(this.translate.instant('succes'));
                this.onList();
            },
            error: error => {
                this.submitted = false;
            }
        });
    }


    // public onChangePageTable(event: any): void {
    //     this.webServiceFilterModel.first = event.first;
    //     this.webServiceFilterModel.sortSense = event.sortOrder === 1 ? 'ASC' : 'DESC';
    //     this.webServiceFilterModel.sortField = event.sortField;
    //     this.onList();
    // }
}
