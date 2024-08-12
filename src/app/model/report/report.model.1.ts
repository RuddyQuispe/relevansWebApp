import {RequestHeaderModel} from '@app/model/requestHeader.model';
import {ReportModel} from '@app/model/report/report.model';

export class ReportModel1 {
    header: RequestHeaderModel;
    reportDto: ReportModel;
    constructor(header: RequestHeaderModel, reportDto: ReportModel) {
        this.header = header;
        this.reportDto = reportDto;
    }
}

