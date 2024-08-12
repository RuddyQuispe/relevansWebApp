import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {VentaFiltroModel, VentaModel} from 'app/model/venta';
import {CONFIG} from '@config/config';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {encryptParam} from '@app/utils/params.security.utils';
import {ValidacionContableService} from '@services/sales/validacion-contable.service';
import {DIRECTION_ORDER_BY, OPTION_ALL, SEARCH_TYPE, STATUS_SALE, T_DOMAIN_TBZ} from '@app/utils/constants';
import {ResponseFilterModel} from '@models/response.filter.model';
import {MensajeService} from '@app/error/mensaje.service';
import {ConfirmationService, SelectItem} from "primeng/api";
import {AuthService} from "@services/auth.service";
import {DomainModel, DomainModelRequestSingle, DomainModelResponseList} from "@models/domain";
import {RequestHeaderModel} from "@models/requestHeader.model";
import {DomainService} from "@services/template/domain.service";

@Component({
    selector: 'app-validacion-contable-lista',
    templateUrl: './validacion-contable-lista.component.html',
    styleUrls: ['./validacion-contable-lista.component.scss']
})
export class ValidacionContableListaComponent implements AfterViewInit {

    public filterSale: VentaFiltroModel;
    public salesResponse: ResponseFilterModel<VentaModel>;
    public sale: VentaModel;
    protected salesSelectedToValidate: Array<VentaModel>;
    protected currentTypesOptions: Array<SelectItem> = [{label: OPTION_ALL, value: ''}];

    public rowsTables: number = Number(CONFIG.ROWS_TABLE);
    public sizeOrders: number;
    public loading: boolean;
    public cmpMin: string;
    public cmpReq: string;
    protected isViewFilterSearchUser: boolean;
    protected readonly SEARCH_TYPE = SEARCH_TYPE;

    constructor(private translateService: TranslateService,
                private authService: AuthService,
                private domainService: DomainService,
                private router: Router,
                private messageService: MensajeService,
                private accountingValidationService: ValidacionContableService,
                private confirmationService: ConfirmationService,
                private changeDetectorRefService: ChangeDetectorRef) {
        this.initializeFilter();
        this.loadCurrentTypesOptions();
        this.loading = false;
        this.isViewFilterSearchUser = false;
        this.salesSelectedToValidate = new Array<VentaModel>();
        this.salesResponse = new ResponseFilterModel<VentaModel>();
        this.sizeOrders = 0;
        this.cmpReq = this.translateService.instant('cmpReq');
        this.cmpMin = this.translateService.instant('cmpMin');
    }

    public ngAfterViewInit(): void {
        this.changeDetectorRefService.detectChanges();
    }


    // #region ABM_SERVICES
    private loadCurrentTypesOptions(): void {
        this.domainService.onList(new DomainModelRequestSingle(new RequestHeaderModel(this.authService.getUser()),
            new DomainModel(T_DOMAIN_TBZ.CURRENT_TYPE))).subscribe({
            next: (response: DomainModelResponseList) => {
                this.currentTypesOptions.push(...response.domains.map((d: DomainModel) => {
                    return {label: d.domName, value: d.domValue, title: d.description};
                }).sort(((d, dc) => {
                    if (d.label < dc.label) return -1;
                    if (d.label > dc.label) return 1;
                    return 0;
                })));
                this.loadSales();
            }
        });
    }

    private loadSales(): void {
        this.loading = true;
        this.filterSale.usuarioVenta = this.authService.getUserId();
        this.filterSale.fechaInicio = this.filterSale.fechaInicioDate.toISOString().slice(0, 10);
        this.filterSale.fechaFin = this.filterSale.fechaFinDate.toISOString().slice(0, 10);
        this.accountingValidationService.onList(VentaFiltroModel.clone(this.filterSale)).subscribe({
            next: (response: ResponseFilterModel<VentaModel>) => {
                this.salesResponse = response;
                this.sizeOrders = this.salesResponse.totalElementos;
                this.loading = false;
            },
            error: err => this.loading = false
        });
    }

    private validateSalesMultiple(): void {
        this.loading = true;
        const salesId: Array<number> = this.salesSelectedToValidate.map(s => s.ventaId);
        this.accountingValidationService.onValidateMultiple(salesId).subscribe({
            next: (response: Array<string>) => {
                if (response.length === 0) {
                    this.messageService.showSuccess(this.translateService.instant('succes'));
                } else {
                    response.forEach(message => this.messageService.showError(message));
                }
                this.loadSales();
            },
            error: err => this.loading = false
        });
    }

    private validateSaleIndividual(saleModel: VentaModel): void {
        this.loading = true;
        this.accountingValidationService.onValidate(saleModel).subscribe({
            next: (response: VentaModel) => {
                this.messageService.showSuccess(this.translateService.instant('succes'));
                this.loadSales();
                this.loading = false;
            },
            error: err => this.loading = false
        });
    }

    // #endregion ABM_SERVICES

    // #region EVENTS
    public onSubmitFilterList(): void {
        this.filterSale.page = 0;
        this.loadSales()
    }

    // public onClickShowDialogToEdit(event: Event, entity: VentaModel): void {
    //     this.router.navigate(['/sales/register-record', encryptParam(JSON.stringify({
    //         id: entity.ventaId,
    //         isView: false
    //     }))]);
    // }

    public onClickShowDialogToView(event: Event, entity: VentaModel): void {
        this.router.navigate(['/sales/register-record', encryptParam(JSON.stringify({
            id: entity.ventaId,
            isView: true
        }))]);
    }

    public onChangePageTable(event: any): void {
        this.filterSale.direction = !event.sortField ? DIRECTION_ORDER_BY.DESC : (event.sortOrder > 0 ? DIRECTION_ORDER_BY.ASC : DIRECTION_ORDER_BY.DESC);
        this.filterSale.page = (event.first / this.rowsTables);
        this.filterSale.orderBy = event.sortField || VentaModel.PROPERTY_VENTA_ID;
        this.filterSale.usuarioVenta = this.authService.getUserId();
        console.log('CHANGE PAGE:', this.filterSale);
        this.loadSales();
    }

    public onClickClearFilter(): void {
        this.initializeFilter();
    }

    protected onChangeInputUserName(): void {
        this.filterSale.usuarioVenta = null;
        this.messageService.showInfo(this.translateService.instant('sale_filter_user_warning'));
    }

    protected onClickShowModalSearchUser(): void {
        this.isViewFilterSearchUser = true;
    }

    protected onClickValidateAllSales(): void {
        this.confirmationService.confirm({
            message: this.translateService.instant('accounting_validate_dialog_confirm_all'),
            header: this.translateService.instant('accounting_validate'),
            icon: 'pi pi-check-circle',
            accept: () => this.validateSalesMultiple()
        });
    }

    protected onClickValidateSale(event: MouseEvent, saleModel: VentaModel): void {
        this.confirmationService.confirm({
            message: this.translateService.instant('accounting_validate_dialog_confirm'),
            header: this.translateService.instant('accounting_validate'),
            icon: 'pi pi-check-circle',
            accept: () => this.validateSaleIndividual(saleModel)
        });
    }

    protected onSelectInitDateFilter(): void {
        if (this.filterSale.fechaInicioDate > this.filterSale.fechaFinDate) {
            this.messageService.showWarning('fecha inicio no valida');
            return;
        }
        this.filterSale.fechaInicio = this.filterSale.fechaInicioDate.toISOString().slice(0, 10);
        this.filterSale.page = 0;
        this.loadSales();
    }

    protected onSelectEndDateFilter(): void {
        if (this.filterSale.fechaFinDate < this.filterSale.fechaInicioDate) {
            this.messageService.showWarning('fecha fin no valida');
            return;
        }
        this.filterSale.fechaFin = this.filterSale.fechaFinDate.toISOString().slice(0, 10);
        this.filterSale.page = 0;
        this.loadSales();
    }

    // #endregion EVENTS

    // #region EXTERNAL_FUNCTIONS

    private initializeFilter(): void {
        this.filterSale = new VentaFiltroModel(
            VentaModel.PROPERTY_VENTA_ID,
            DIRECTION_ORDER_BY.DESC,
            0,
            this.rowsTables,
            new Date().toString(),
            new Date().toString(),
            null,
            null,
            [STATUS_SALE.AUTORIZADA],
            null,
            this.authService.getUserId()
        );
        this.filterSale.fechaInicioDate = new Date(this.filterSale.fechaFin);
        this.filterSale.fechaFinDate = new Date(this.filterSale.fechaFin);
    }

    // #endregion EXTERNAL_FUNCTIONS
}
