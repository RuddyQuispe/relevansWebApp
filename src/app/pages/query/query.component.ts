import {Component, OnInit} from '@angular/core';
import {QueryService} from '@services/template/query.service';
import {AuthService} from '@services/auth.service';
import {MensajeService} from '@app/error/mensaje.service';
import {QueryModel, QueryModelRequestSingle, QueryModelResponseList, QueryModelResponseSingle} from '@app/model/query';
import {TranslateService} from '@ngx-translate/core';
import {RequestHeaderModel} from '@app/model/requestHeader.model';
import {CONFIG} from '@config/config';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-query',
    templateUrl: './query.component.html'
})
export class QueryComponent implements OnInit {

    cmpMin: string;
    cmpReq: string;
    rowsTables: number = Number(CONFIG.ROWS_TABLE);
    list: Array<QueryModel> = [];
    entity: QueryModel;
    entitySelect: QueryModel;
    displayDialog: boolean;
    error: { errorTitle: '', errorDesc: '' };
    isView: boolean;
    jsonResultado: string;
    submitted = false;
    loading = false;

    constructor(
        private queryService: QueryService,
        private authService: AuthService,
        private translate: TranslateService,
        private mensajeService: MensajeService
    ) {
    }

    ngOnInit() {
        this.cmpReq = this.translate.instant('cmpReq');
        this.cmpMin = this.translate.instant('cmpMin');
        this.onList();
    }

    private onList() {
        this.loading = true;
        this.list = [];
        this.queryService.list(new QueryModelRequestSingle(
            new RequestHeaderModel(this.authService.getUser()),
            new QueryModel())).subscribe({
            next: (data: QueryModelResponseList) => {
                this.loading = false;
                this.list = data.queries;
            },
            error: error => {
                this.loading = false;
            }
        });
    }

    showDialogToCreate(event: Event) {
        this.jsonResultado = '';
        this.isView = false;
        this.entity = new QueryModel();
        // assign last time of changes
        this.entity.lastTime = new Date().toString();
        this.entity.lastUser = this.authService.getUser();

        this.displayDialog = true;
        event.preventDefault();
    }

    showDialogToEdit(event: Event, enty: QueryModel | undefined) {
        this.jsonResultado = '';
        this.isView = false;
        this.entity = new QueryModel().clone(enty);
        this.displayDialog = true;
        event.preventDefault();
    }

    showDialogToView(event: Event, enty: QueryModel) {
        this.jsonResultado = '';
        this.isView = true;
        this.entity = new QueryModel().clone(enty);
        this.validateJson(event, this.entity);

        this.displayDialog = true;
        event.preventDefault();
    }

    onSubmit() {
        this.save(new QueryModel().clone(this.entity));
    }

    save(newQuery: QueryModel) {
        this.submitted = true;
        const header = new RequestHeaderModel(this.authService.getUser());
        const queryRequest = new QueryModelRequestSingle(header, newQuery);
        const queryResultObservable: Observable<QueryModelResponseSingle> = (newQuery.queryId === undefined) ?
            this.queryService.save(queryRequest) :
            this.queryService.merge(queryRequest);

        queryResultObservable.subscribe({
            next: (data: QueryModelResponseSingle) => {
                this.submitted = false;
                this.displayDialog = false;
                this.entity = null;
                this.mensajeService.showSuccess(this.translate.instant('succes'));
                this.onList();
            },
            error: error => {
                this.submitted = false;
            }
        });
    }

    validateJson(event: Event, query: QueryModel) {
        this.submitted = true;
        this.jsonResultado = '';
        const header = new RequestHeaderModel(this.authService.getUser());
        const queryRequest = new QueryModelRequestSingle(header, query);

        this.queryService.validate(queryRequest).subscribe({
            next: (data: any) => {
                this.submitted = false;
                if (data.header.codReturn !== '200 OK') {
                    this.mensajeService.showError(this.translate.instant('query_jsonInvalid'));
                } else {
                    if (data.data === '')
                        this.mensajeService.showError(this.translate.instant('query_jsonEmpty'));
                    this.jsonResultado = JSON.stringify(data.data.queryResolved);
                }
            },
            error: error => {
                this.submitted = false;
            }
        });
    }

    close() {
        this.displayDialog = false;
        this.submitted = false;
    }

}
