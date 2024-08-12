import {Component, OnInit} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {JobService} from '@services/template/job.service';
import {MensajeService} from '@app/error/mensaje.service';
import {AuthService} from '@services/auth.service';
import {RequestHeaderModel} from '@app/model/requestHeader.model';
import {TranslateService} from '@ngx-translate/core';
import {CONFIG} from '@config/config';
import {JobModel, JobModelRequestSingle, JobModelResponseList, JobModelResponseSingle} from '@app/model/job';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-job',
    templateUrl: './job.component.html'
})
export class JobComponent implements OnInit {

    cmpReq: string;
    cmpMin: string;
    valueMax: string;
    rowsTables: number = Number(CONFIG.ROWS_TABLE);
    list: Array<JobModel> = [];
    selectJob: JobModel;
    auxJob: JobModel;
    displayDialog: boolean;
    isView: boolean;

    concurrent: SelectItem[] = [];
    enable: SelectItem[] = [];
    selectedDay: number[] = [];
    time: Date;
    day: boolean;

    /*Expresion*/
    seconds = '*';
    minutes = '*';
    hours = '*';
    days = '*';

    submitted = false;
    loading = false;

    constructor(
        public jobService: JobService,
        private authService: AuthService,
        private translate: TranslateService,
        private mensajeService: MensajeService
    ) {
        this.day = false;
    }

    ngOnInit() {
        this.cmpReq = this.translate.instant('cmpReq');
        this.cmpMin = this.translate.instant('cmpMin');
        this.valueMax = this.translate.instant('valueMax');
        this.concurrent = [
            {label: this.translate.instant('yes'), value: true},
            {label: this.translate.instant('not'), value: false}
        ];
        this.enable = [
            {label: this.translate.instant('yes'), value: true},
            {label: this.translate.instant('not'), value: false}
        ];
        this.onList();
    }

    onList() {
        this.loading = true;
        const header = new RequestHeaderModel(this.authService.getUser());
        const jobRequest = new JobModelRequestSingle(header, new JobModel());
        this.jobService.onList(jobRequest).subscribe({
            next: (data: JobModelResponseList) => {
                this.loading = false;
                this.list = data.jobs;
            },
            error: error => {
                this.loading = false;
            }
        });
    }

    onChangeType() {
        console.log(this.selectedDay.sort());
        this.days = '';
        // tslint:disable-next-line:only-arrow-functions
        const dataNumber = this.selectedDay.map(function (value) {
            return Number(value);
        });
        this.days = dataNumber.toString();
        this.setExpresion();
    }

    onBlurTime() {
        this.hours = '' + this.time.getHours();
        this.minutes = '' + this.time.getMinutes();
        this.seconds = '' + this.time.getSeconds();
        this.setExpresion();
    }

    setExpresion() {
        if (this.selectedDay.length === 0) {
            this.days = '*';
        }
        this.auxJob.schedule = this.seconds + ' ' + this.minutes + ' ' + this.hours + ' ' + this.days + ' * *';
    }

    onSubmit() {
        this.save(new JobModel().clone(this.auxJob));
    }

    save(value: JobModel) {
        const header = new RequestHeaderModel(this.authService.getUser());
        value.lastUser = header.user || 'nothing';
        value.lastTime = new Date();
        const jobRequest = new JobModelRequestSingle(header, value);
        this.submitted = true;
        const observableResponse: Observable<JobModelResponseSingle> = (this.auxJob.jobId !== undefined && this.auxJob.jobId > 0) ?
            this.jobService.onMergue(jobRequest) : this.jobService.onSave(jobRequest);
        observableResponse.subscribe({
            next: (data: JobModelResponseSingle) => {
                this.submitted = false;
                this.displayDialog = false;
                this.mensajeService.showSuccess(this.translate.instant('succes'));
                this.onList();
            },
            error: error => {
                this.submitted = false;
            }
        });
    }

    private find(jobModel: JobModel): void {
        this.submitted = true;
        this.auxJob = null;
        this.jobService.onFind(new JobModelRequestSingle(
            new RequestHeaderModel(this.authService.getUser()), jobModel)).subscribe({
            next: (data: JobModelResponseSingle) => {
                this.auxJob = data.job;
                this.submitted = false;
                this.displayDialog = true;
            },
            error: error => this.submitted = false
        });
    }

    showView(event: Event, job: JobModel) {
        this.find(job);
        this.displayDialog = true;
        this.isView = true;
        event.preventDefault();
    }

    showEdit(event: Event, job: JobModel) {
        this.find(job);
        this.displayDialog = true;
        this.isView = false;
        event.preventDefault();
    }

    showDialogToAdd() {
        this.isView = false;
        this.auxJob = new JobModel();
        this.auxJob.maxThreads = 0;
        this.displayDialog = true;
    }
}
