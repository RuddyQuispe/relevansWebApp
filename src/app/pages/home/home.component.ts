import {Component, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {DatePipe} from '@angular/common';
import {DashModel} from '@app/model/dashboard/dash.model';
import {D1} from '@app/model/dashboard/d1';
import {RequestHeaderModel} from '@app/model/requestHeader.model';
import {AuthService} from '@services/auth.service';
import {DashboardService} from '@services/dashboard.service';
import {TranslateService} from '@ngx-translate/core';
import {ItemsModel} from '@app/model/util';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    options: any;
    d1: D1;

    cmpReq: string;
    submitted = false;
    bancos: ItemsModel[] = [];

    companyId: number;

    constructor(private datePipe: DatePipe,
                private authService: AuthService,
                private dashboardService: DashboardService,
                private translate: TranslateService) {
    }

    ngOnInit() {
        this.cmpReq = this.translate.instant('cmpReq');

        this.d1 = new D1();
        this.d1.header = new RequestHeaderModel(this.authService.getUser());
        const inicio = new Date();
        inicio.setDate(inicio.getDate() - inicio.getUTCDate() + 1);
        this.d1.fechaInicio = inicio;
        const fin = new Date();
        this.d1.fechaFin = fin;
        this.d1.sdf = '10';
        this.filtrar();
        if (this.authService.getCompanyId() != null && this.authService.getCompanyId() > 0) {
            console.log('COMPANY ID::', this.companyId);
        }
        // else{
        // this.listBanco();
        // }
    }


    filtrar() {
        // console.log('DASHBOARD1:.', this.d1);
        /* this.dashboardService.list(this.d1).subscribe(
            (data: D2) => {
                console.log('DASHBOARD2:.', data);
                this.loadDash(data.list);
            },
            error => {
            }
        ); */
    }

    loadDash(lista: DashModel[]) {
        const FECHAS = [];
        const GENERADOS = [];
        const LEIDOS = [];

        lista.forEach(function (l) {
            if (!FECHAS.includes(l.fecha)) {
                FECHAS.push(l.fecha);
            }
        });

        let i = 0;
        FECHAS.forEach(function (item) {
            const items = lista.filter(x => x.fecha === item);
            console.log(items);
            items.forEach(function (select) {
                switch (select.descripcion) {
                    case 'GENERADOS':
                        GENERADOS.push(select.cantidad);
                        break;
                    case 'LEIDOS':
                        LEIDOS.push(select.cantidad);
                        break;
                    default:
                        break;
                }
            });

            // verificando
            if (GENERADOS[i] === undefined) {
                GENERADOS.push(0);
            }
            if (LEIDOS[i] === undefined) {
                LEIDOS.push(0);
            }
            i++;
        });


        const TOTAL_GENERADOS = GENERADOS.reduce((acc, val) => acc + val, 0);
        const TOTAL_LEIDOS = LEIDOS.reduce((acc, val) => acc + val, 0);


        const fechaIni = this.datePipe.transform(this.d1.fechaInicio, 'dd/MM/yyyy');
        const fechaFin = this.datePipe.transform(this.d1.fechaFin, 'dd/MM/yyyy');

        this.options = {
            title: {
                text: 'CANTIDAD DE QR GENERADOS Y LEIDOS'
            },
            subtitle: {
                text: 'Fecha del: ' + fechaIni + ' al: ' + fechaFin
            },
            chart: {
                animation: false
            },
            xAxis: {
                categories: FECHAS,
                title: {
                    text: null
                }
            },
            yAxis: {
                title: {
                    text: 'Cantidad de QR.'
                }

            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    states: {
                        inactive: {
                            opacity: 1
                        }
                    },
                }
            },
            series: [{
                type: 'column',
                name: 'QR GENERADOS',
                data: GENERADOS
            }, {
                type: 'column',
                name: 'QR LEIDOS',
                data: LEIDOS
            }, {
                type: 'spline',
                name: 'QR GENERADOS',
                data: GENERADOS,
                marker: {
                    lineWidth: 3,
                    lineColor: Highcharts.getOptions().colors[3],
                    fillColor: 'white'
                }
            }, {
                type: 'pie',
                data: [{
                    name: 'QR GENERADOS',
                    y: TOTAL_GENERADOS,
                    color: Highcharts.getOptions().colors[0]
                }, {
                    name: 'QR LEIDOS',
                    y: TOTAL_LEIDOS,
                    color: Highcharts.getOptions().colors[1]
                }],
                center: ['95%', -15],

                size: 80,
                showInLegend: false,
                dataLabels: {
                    enabled: false
                }
            }]
        };
        Highcharts.chart('container', this.options);
    }

}
