import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LogwebService} from '@services/template/logweb.service';
import {AuthService} from '@services/auth.service';
import {CONFIG} from '@config/config';
import {MensajeService} from '@app/error/mensaje.service';
import {LazyLoadEvent, SelectItem} from 'primeng/api';
import {LogWebServiceModel, LogWebServiceModelResponse, LogWebServiceRequestModel} from '@app/model/logweb';
import {TranslateService} from '@ngx-translate/core';
import {RequestHeaderModel} from '@app/model/requestHeader.model';
import {DIRECTION_ORDER_BY, LOG_WS_APP_REQUEST} from '@app/utils/constants';

@Component({
    selector: 'app-logweb',
    templateUrl: './logweb.component.html',
    styleUrls: ['./logweb.component.scss']
})
export class LogwebComponent implements OnInit, AfterViewInit {

    protected rowsTables: number = Number(CONFIG.ROWS_TABLE);
    protected logs: LogWebServiceModel[] = [];
    protected logWebServiceSelected: LogWebServiceModel;
    protected logWebServiceFilter: LogWebServiceModel;
    protected displayDialog: boolean = false;
    protected isRequest: boolean;
    protected totalRecords: number = 0;

    protected loading = false;
    protected readonly LOG_WS_APP_REQUEST = LOG_WS_APP_REQUEST;

    constructor(private logWebService: LogwebService,
                private authService: AuthService,
                private translate: TranslateService,
                private messageService: MensajeService,
                private changeDetectorService: ChangeDetectorRef) {
    }

    public ngAfterViewInit(): void {
        this.changeDetectorService.detectChanges();
    }

    public ngOnInit(): void {
        console.log(LOG_WS_APP_REQUEST[LOG_WS_APP_REQUEST.APP_CONFIG.toString()])
        this.clearFilter();
        /*Iniciar si viene del Reporte*/
        // this.initForMessage();
    }

    public filter(): void {
        this.loading = true;
        this.logs = [];
        const logwebModel1: LogWebServiceRequestModel = new LogWebServiceRequestModel(
            new RequestHeaderModel(this.authService.getUser()), LogWebServiceModel.clone(this.logWebServiceFilter));
        console.log('REQUEST FILTER::', logwebModel1);
        this.logWebService.list(logwebModel1).subscribe({
            next: (data: LogWebServiceModelResponse) => {
                console.log('RESPONSE FILTER::::: ' + data);
                this.loading = false;
                this.logs = data.logServices.list;
                if (this.logs === null) {
                    this.messageService.showWarning(this.translate.instant('emptyFilter'));
                }
                this.totalRecords = data.logServices.totalRows;
            },
            error: error => {
                this.loading = false;
            }
        });
    }

    onFilter() {
        this.filter();
    }

    clearFilter() {
        this.logWebServiceFilter = new LogWebServiceModel();
        this.logWebServiceFilter.appRequest = null;
        this.logWebServiceFilter.ipRequest = '';
        this.logWebServiceFilter.beginDate = new Date();
        this.logWebServiceFilter.beginDate.setHours(0, 0, 0, 0);
        this.logWebServiceFilter.endDate = new Date();
        this.logWebServiceFilter.endDate.setHours(0, 0, 0, 0);
    }

    showDialogToViewRequest(event: Event, enty: LogWebServiceModel) {
        this.logWebServiceSelected = enty;
        this.logWebServiceSelected.request = JSON.stringify(JSON.parse(this.logWebServiceSelected.request.trim()), null, 4);
        this.displayDialog = true;
        this.isRequest = true;
    }

    showDialogToViewResponse(event: Event, enty: LogWebServiceModel) {
        this.logWebServiceSelected = enty;
        this.logWebServiceSelected.response = JSON.stringify(JSON.parse(this.logWebServiceSelected.response), null, 4);
        this.isRequest = false;
        this.displayDialog = true;
    }

    protected loadLazy(event: LazyLoadEvent): void {
        this.logWebServiceFilter.first = event.first;
        this.logWebServiceFilter.pageSize = event.rows;
        this.logWebServiceFilter.sortSense = !event.sortField ? DIRECTION_ORDER_BY.DESC : (event.sortOrder === 1 ? DIRECTION_ORDER_BY.ASC : DIRECTION_ORDER_BY.DESC);
        this.logWebServiceFilter.sortField = event.sortField ? event.sortField : '1';
        this.filter();
    }
}
