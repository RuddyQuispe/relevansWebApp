import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ResponseFilterModel} from "@models/response.filter.model";
import {MenuApiFilterModel, MenuApiModel} from "@models/menu-api";
import {CONFIG} from "@config/config";
import {AuthService} from "@services/auth.service";
import {TranslateService} from "@ngx-translate/core";
import {MensajeService} from "@app/error/mensaje.service";
import {ConfirmationService} from "primeng/api";
import {DIRECTION_ORDER_BY} from "@app/utils/constants";
import {MenuApiService} from "@services/admin/menu-api.service";
import {Observable, raceWith} from "rxjs";

@Component({
    selector: 'app-menu-api',
    templateUrl: './menu-api.component.html',
    styleUrls: ['./menu-api.component.scss']
})
export class MenuApiComponent implements AfterViewInit {

    protected menuApiResponse: ResponseFilterModel<MenuApiModel>;
    protected menuApiModel: MenuApiModel;
    protected menuApiFilterModel: MenuApiFilterModel;

    protected rowsTables: number = Number(CONFIG.ROWS_TABLE);
    protected loading: boolean;
    protected sizeRecordsTable: number;
    protected isViewMenuApiDialog: boolean;
    protected displayDialogMenuApi: boolean;

    constructor(private menuApiService: MenuApiService,
                private authService: AuthService,
                private translateService: TranslateService,
                private messageService: MensajeService,
                private confirmationService: ConfirmationService,
                private changeDetectorService: ChangeDetectorRef) {
        this.menuApiResponse = new ResponseFilterModel<MenuApiModel>();
        this.loading = false;
        this.displayDialogMenuApi = false;
        this.isViewMenuApiDialog = false;
        this.sizeRecordsTable = 0;
        this.initializeFilter();
    }

    public ngAfterViewInit(): void {
        this.changeDetectorService.detectChanges();
    }

    // #region ABM_SERVICE
    private loadMenuApis(): void {
        this.loading = true;
        this.menuApiService.onListByFilter(MenuApiFilterModel.clone(this.menuApiFilterModel)).subscribe({
            next: (response: ResponseFilterModel<MenuApiModel>) => {
                this.menuApiResponse = response;
                this.sizeRecordsTable = response.totalElementos;
                this.loading = false;
            },
            error: err => this.loading = false
        })
    }

    private findMenu(menuId: number): void {
        this.loading = true;
        this.menuApiService.onFindById(menuId).subscribe({
            next: (response: MenuApiModel) => {
                this.menuApiModel = response;
                this.loading = false;
            },
            error: err => this.loading = false
        })
    }

    private saveOrUpdateMenu(): void {
        this.loading = true;
        this.menuApiModel.lastUser = this.authService.getUser();
        this.menuApiModel.lastTime = new Date().toISOString().slice(0, 19);
        const menuResponseObserver: Observable<MenuApiModel> = this.menuApiModel.menuId ?
            this.menuApiService.onMerge(MenuApiModel.clone(this.menuApiModel)) :
            this.menuApiService.onSave(MenuApiModel.clone(this.menuApiModel));

        menuResponseObserver.subscribe({
            next: (response: MenuApiModel) => {
                this.messageService.showSuccess(this.translateService.instant('succes'));
                this.loadMenuApis();
                this.closeMenuApiDialog();
                this.loading = false;
            },
            error: err => this.closeMenuApiDialog()
        })


    }

    // #endregion ABM_SERVICE

    // #region EVENTS
    protected onClickShowDialogToAddMenuApi(): void {
        this.isViewMenuApiDialog = false;
        this.displayDialogMenuApi = true;
        this.menuApiModel = new MenuApiModel();
    }

    protected onChangePageTableMenu(event: any) {
        this.menuApiFilterModel.page = event.first / this.rowsTables;
        this.menuApiFilterModel.direction = event.sortOrder > 0 ? DIRECTION_ORDER_BY.ASC : DIRECTION_ORDER_BY.DESC;
        this.menuApiFilterModel.orderBy = event.sortField || 'menuId';
        this.menuApiFilterModel.nombre = event.globalFilter;
        this.loadMenuApis();
    }

    protected onClickShowDialogToEdit(event: MouseEvent, menuApiModel: MenuApiModel) {
        this.findMenu(menuApiModel.menuId);
        this.isViewMenuApiDialog = false;
        this.displayDialogMenuApi = true;
        event.preventDefault();
    }

    protected onClickShowDialogToView(event: MouseEvent, menuApiModel: MenuApiModel) {
        this.findMenu(menuApiModel.menuId);
        this.isViewMenuApiDialog = true;
        this.displayDialogMenuApi = true;
        event.preventDefault();
    }

    protected onClickCloseDialogMenuApi(): void {
        this.closeMenuApiDialog();
    }

    protected onSubmitMenuApi() {
        this.confirmationService.confirm({
            header: this.translateService.instant(!this.menuApiModel.menuId ? 'menu_api_title_register' :
                'menu_api_title_update'),
            message: this.translateService.instant(!this.menuApiModel.menuId ? 'menu_api_message_confirm_register' :
                'menu_api_message_confirm_update'),
            accept: () => this.saveOrUpdateMenu()
        })
    }

    // #endregion EVENTS

    // #region EXTERNAL_FUNCTIONS
    private initializeFilter(): void {
        this.menuApiFilterModel = new MenuApiFilterModel(
            'menuId',
            DIRECTION_ORDER_BY.DESC,
            0,
            this.rowsTables,
            null
        );
    }

    private closeMenuApiDialog(): void {
        this.isViewMenuApiDialog = false;
        this.displayDialogMenuApi = false;
    }

    // #endregion EXTERNAL_FUNCTIONS
}
