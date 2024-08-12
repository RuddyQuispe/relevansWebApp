import {Component, OnInit} from '@angular/core';
import {AuthService} from '@services/auth.service';
import {MensajeService} from '@app/error/mensaje.service';
import {TranslateService} from '@ngx-translate/core';
import {RequestHeaderModel} from '@app/model/requestHeader.model';
import {CONFIG, TYPE_PRIVATE_KEY} from '@config/config';
import {PrivkeyModel, PrivkeyModelRequest, PrivkeyModelResponseSingle, PrivkeyModelResponseList} from '@app/model/privkey';
import {PrivkeyService} from '@services/template/privkey.service';
// import {ClearingHouseModel, ClearingHouseModelRequestSingle, ClearingHouseModelResponseList} from '@models/clearinghouse';
import {ItemsModel} from '@models/util';
// import {ClearingHouseService} from '@services/clearinghouse.service';
// import {CompanyModel, CompanyModelRequestSingle, CompanyModelResponseList} from '@models/company';
import {SelectItem} from 'primeng/api';
// import {CompanyService} from '@services/company.service';

@Component({
    selector: 'app-privkey',
    templateUrl: './privkey.component.html'
})
export class PrivkeyComponent implements OnInit {
    rowsTables: number;
    list: Array<PrivkeyModel>;
    entity: PrivkeyModel;
    entitySelect: PrivkeyModel;
    displayDialog: boolean;
    isView: boolean;
    submitted: boolean;
    loading: boolean;
    // clearingHouses: Array<ClearingHouseModel>;
    clearingHousesDropDownModel: Array<ItemsModel>;

    eyePass: boolean;

    protected companyId: number;
    // Filters
    companies: Array<any>;
    companiesDropDownList: Array<SelectItem>;
    filterModel: any;
    // Filters

    protected readonly TYPE_PRIVATE_KEY = TYPE_PRIVATE_KEY;

    constructor(
        private privkeyService: PrivkeyService,
        private authService: AuthService,
        private translate: TranslateService,
        private messageService: MensajeService,
    ) {
        this.initModels();
        if (this.companyId === undefined || this.companyId === null) {
            this.loadCompanies();
        }
    }

    private initModels() {
        this.rowsTables = Number(CONFIG.ROWS_TABLE);
        this.list = new Array<PrivkeyModel>();
        this.submitted = false;
        this.loading = false;
        this.eyePass = false;
        // this.clearingHouses = new Array<ClearingHouseModel>();
        this.clearingHousesDropDownModel = new Array<ItemsModel>();
        this.companies = new Array<any>();
        this.companiesDropDownList = new Array<SelectItem>();
        this.filterModel = new Object();
    }

    ngOnInit() {
        this.listClearingHouses();
        this.onList();
    }

    private listClearingHouses(): void {
        // this.loading = true;
        // const header = new RequestHeaderModel(this.authService.getUser());
        //
        // const clearingHouseModel = new ClearingHouseModel();
        // clearingHouseModel.companyId = this.companyId;
        // const clearingHouseRequest = new ClearingHouseModelRequestSingle(header, clearingHouseModel);
        // this.clearingHouseService.list(clearingHouseRequest).subscribe(
        //     (response: ClearingHouseModelResponseList) => {
        //         this.clearingHouses = response.clearingHouses;
        //         this.loadClearingHouseDropDownList(this.clearingHouses);
        //     }
        // );
    }

    protected onList() {
        this.loading = true;
        const header = new RequestHeaderModel(this.authService.getUser());
        const privkeyModel = new PrivkeyModel();
        privkeyModel.companyId = (this.companyId === undefined || this.companyId === null) ? this.filterModel.companyId : this.companyId;
        const privkeyModel1 = new PrivkeyModelRequest(header, privkeyModel);

        this.privkeyService.list(privkeyModel1).subscribe({
            next: (data: PrivkeyModelResponseList) => {
                this.list = data.privkeys;
                this.list.forEach(element => {
                    element.initDate = new Date(element.initDate);
                    element.endDate = new Date(element.endDate);
                });
                this.loading = false;
            },
            error: error => {
                this.loading = false;
            }
        });
    }

    showDialogToAdd() {
        this.isView = false;
        this.entity = new PrivkeyModel();
        this.entity.companyId = this.companyId;
        this.entity.enabled = true;
        this.entity.typeKey = 'PKEY';
        this.displayDialog = true;
    }

    showDialogToEdit(event: Event, enty: PrivkeyModel) {
        this.isView = false;
        this.entity = new PrivkeyModel().clone(enty);
        this.find(this.entity);
        event.preventDefault();
    }

    showDialogToView(event: Event, enty: PrivkeyModel) {
        this.isView = true;
        this.entity = new PrivkeyModel().clone(enty);
        this.displayDialog = true;
        event.preventDefault();
    }

    onSubmit() {
        this.save(new PrivkeyModel().clone(this.entity));
    }

    save(privkeyModel: PrivkeyModel) {
        this.submitted = true;
        const header = new RequestHeaderModel(this.authService.getUser());
        const privkeyModelRequest = new PrivkeyModelRequest(header, privkeyModel);
        if (privkeyModel.privKeyId > 0) {
            this.privkeyService.merge(privkeyModelRequest).subscribe({
                next: (data: PrivkeyModelResponseSingle) => {
                    this.submitted = false;
                    this.messageService.showSuccess(this.translate.instant('succes'));
                    this.displayDialog = false;
                    this.entity = null;
                    this.onList();
                },
                error: error => {
                    this.submitted = false;
                }
            });
        } else {
            privkeyModelRequest.privkey.companyId = this.companyId;
            this.privkeyService.persist(privkeyModelRequest).subscribe({
                next: (data: PrivkeyModelResponseSingle) => {
                    this.submitted = false;
                    this.messageService.showSuccess(this.translate.instant('succes'));
                    this.displayDialog = false;
                    this.entity = null;
                    this.onList();
                },
                error: error => {
                    this.submitted = false;
                }
            });
        }
    }

    find(enty: PrivkeyModel) {
        this.submitted = true;
        const header = new RequestHeaderModel(this.authService.getUser());
        const privkeyModel1 = new PrivkeyModelRequest(header, enty);

        // console.log('find1::', privkeyModel1);
        this.privkeyService.find(privkeyModel1).subscribe({
                next: (data: PrivkeyModelResponseSingle) => {
                    // console.log('find2::', data);
                    this.submitted = false;
                    this.entity = data.privkey;
                    this.entity.initDate = new Date(this.entity.initDate);
                    this.entity.endDate = new Date(this.entity.endDate);
                    this.displayDialog = true;
                },
                error: error => {
                    this.submitted = false;
                }
            }
        );
    }

    close() {
        this.displayDialog = false;
        this.submitted = false;
    }

    togogleEyePass() {
        this.eyePass = !this.eyePass;
    }

    loadCompanies() {
        // const company: CompanyModel = new CompanyModel();
        // const header: RequestHeaderModel = new RequestHeaderModel(this.authService.getUser());
        // const request: CompanyModelRequestSingle = new CompanyModelRequestSingle(header, company);
        //
        // this.companyService.list(request).subscribe({
        //     next: (response: CompanyModelResponseList) => {
        //         this.companies = response.companies;
        //         this.companiesDropDownList = [
        //             new ItemsModel().nuevo(this.translate.instant('selectList'), ''),
        //             ...this.companies.map((companyModel: CompanyModel) => new ItemsModel().companyToItem(companyModel)
        //             )
        //         ];
        //     },
        //     error: (error): void => {
        //         console.log(error);
        //     }
        // });
    }

    changeCompany() {
        // this.loadClearingHouseDropDownList(
        //     this.clearingHouses.filter((clearingHouseModel: ClearingHouseModel) => clearingHouseModel.companyId === this.entity.companyId));
    }

    // loadClearingHouseDropDownList(clearingHouses: ClearingHouseModel[]) {
    //     // this.clearingHousesDropDownModel = clearingHouses.map(ch => new ItemsModel().clearingHouseToItem(ch));
    // }
}
