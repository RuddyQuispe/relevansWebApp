import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ParametrosSaiService} from '@services/admin/parametros-sai.service';
import {GenericSearchRequestModel, GenericSearchResponseModel} from '@models/generic-response';
import {DIRECTION_ORDER_BY, SEARCH_TYPE} from '@app/utils/constants';
import {UserService} from '@services/template/user.service';
import {UserModel, UserModelRequestSingle, UserModelResponseList} from '@models/user';
import {AuthService} from '@services/auth.service';
import {RequestHeaderModel} from '@models/requestHeader.model';
import {Table} from 'primeng/table';
import {CONFIG} from '@config/config';

@Component({
    selector: 'shared-dialog-generic-search',
    templateUrl: './dialog-generic-search.component.html',
    styleUrls: ['./dialog-generic-search.component.scss']
})
export class DialogGenericSearchComponent implements OnInit, OnChanges {

    @Input() public id: string;
    @Input() public titleDialog: string;
    @Input() public typeSearch: SEARCH_TYPE;
    @Input() public visible: boolean;
    @Input() public code: number;
    @Input() public description: string;
    @Output() public eventClose: EventEmitter<boolean>;
    @Output() public eventSelectResponse: EventEmitter<GenericSearchResponseModel>;
    @ViewChild('tableFilterSearch') public tableFilterSearch: Table;

    protected readonly SEARCH_TYPE = SEARCH_TYPE;

    public data: Array<GenericSearchResponseModel>;
    public loading: boolean;
    public sizeOrders: number;
    public rowsTables: number = Number(CONFIG.ROWS_TABLE);
    public dataSelected: GenericSearchResponseModel;
    private requestFilterModel: GenericSearchRequestModel;

    constructor(private saiParametersService: ParametrosSaiService,
                private userService: UserService,
                private authService: AuthService) {
        this.visible = false;
        this.loading = false;
        this.titleDialog = '';
        this.requestFilterModel = new GenericSearchRequestModel(
            null,
            null,
            this.typeSearch,
            DIRECTION_ORDER_BY.ASC,
            GenericSearchRequestModel.NAME_CODE_COLUMN,
            1,
            this.rowsTables
        );
        this.data = [];
        this.code = null;
        this.description = null;
        this.eventClose = new EventEmitter<boolean>();
        this.eventSelectResponse = new EventEmitter<GenericSearchResponseModel>();
    }

    public ngOnInit(): void {
        this.loadData();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (!changes.visible || this.visible !== true)
            return;
        this.code = !this.code ? null : this.code;
        this.dataSelected = null;
        this.initializePaginationParams();
        this.onChangeDescriptionFilter({
            target: {
                value: this.description
            }
        });
    }

    private loadData(): void {
        this.data = [];
        this.code = !this.code ? null : this.code;
        this.description = this.description === '' || this.description === undefined ? null : this.description;
        this.getList();
    }

    // #region ABM_SERVICES
    public getList(): void {
        if (!this.typeSearch && !this.visible)
            return;

        this.loading = true;
        this.data = [];
        // SYSTEM_USER IS ANOTHER SERVICE THAT NO CONTAINS SAI PARAMETERS SERVICES
        if (this.typeSearch === SEARCH_TYPE.SYSTEM_USER) {
            const userModel: UserModel = new UserModel(null, this.code, this.description, null, null,
                null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null, null,
                // UserModel.COLUMN_MAIN_USER_ID,
                // DIRECTION_ORDER_BY.ASC,
                // this.requestFilterModel.page - 1,
                // this.requestFilterModel.pageSize,
                // this.rowsTables,
            );
            this.userService.list(new UserModelRequestSingle(new RequestHeaderModel(this.authService.getUser()), userModel)).subscribe({
                next: (response: UserModelResponseList) => {
                    this.data = response.users.map(u => new GenericSearchResponseModel(u.userId, u.userName));
                    this.loading = false;
                },
                error: err => this.loading = false
            });
            return;
        }
        let filterItems: GenericSearchRequestModel = this.requestFilterModel.clone();
        filterItems.codParametro = this.typeSearch === SEARCH_TYPE.VIA_PAGO_X_CASTIGO ?
            SEARCH_TYPE.VIA_PAGO_X_CONSUMO_DE_VALE : this.typeSearch;
        filterItems.codigo = this.code;
        filterItems.descripcion = this.description;
        this.saiParametersService.onListSaiParameters(filterItems)
            .subscribe({
                next: (response: any) => {
                    this.data = response.contenido;
                    this.loading = false;
                    this.sizeOrders = response.totalElementos;
                },
                error: err => this.loading = false
            });
    }

    // #endregion ABM_SERVICES

    // #region EVENTS

    public onClickDataSelected(): void {
        this.eventSelectResponse.emit(this.dataSelected);
        this.closeDialog();
    }

    public onClickCancelSearch(): void {
        this.closeDialog();
    }

    public onChangeCodeFilter(event: any): void {
        console.log('FILTER BY CODE: ', event.target.value);
        // si es vacio, no se filtrará, (NULL ASSIGN)
        this.code = event.target.value === '' || event.target.value === null ? null : event.target.value;
        this.initializePaginationParams();
        this.getList();
    }

    public onChangeDescriptionFilter(event: any): void {
        console.log('FILTER BY NAME: ', event.target.value);
        // si es vacio, no se filtrará, (NULL ASSIGN)
        this.description = event.target.value === '' || event.target.value === null ? null : event.target.value;
        this.initializePaginationParams();
        this.getList();
    }

    public onChangePageTable(event: any): void {
        this.requestFilterModel.page = (event.first / this.rowsTables) + 1;
        this.requestFilterModel.direction = event.sortOrder > 0 ? DIRECTION_ORDER_BY.ASC : DIRECTION_ORDER_BY.DESC;
        this.requestFilterModel.orderBy = event.sortField || GenericSearchRequestModel.NAME_CODE_COLUMN;
        console.log('CHANGE PAGE:', this.requestFilterModel);
        this.loadData();
    }

    // #endregion EVENTS

    // #region EXTERNAL_FUNCTIONS
    public closeDialog(): void {
        this.eventClose.emit(true);
    }

    private initializePaginationParams(): void {
        this.tableFilterSearch.first = 1;
        this.requestFilterModel.page = 1;
        this.requestFilterModel.direction = DIRECTION_ORDER_BY.ASC;
        this.requestFilterModel.orderBy = GenericSearchRequestModel.NAME_CODE_COLUMN;
    }

    // #endregion EXTERNAL_FUNCTIONS
    public onDoubleClickItemSelection(data: GenericSearchResponseModel): void {
        this.dataSelected = data;
        this.eventSelectResponse.emit(this.dataSelected);
        this.closeDialog();
    }
}
