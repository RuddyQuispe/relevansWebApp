import {RequestHeaderModel} from '../requestHeader.model';
import {ExportModel} from "@app/model/export/export.model";

export class EX1Model {
    header: RequestHeaderModel;
    exportDto: ExportModel;
    timeout: number;
    constructor(header: RequestHeaderModel, exportDto: ExportModel, timeout?: number) {
        this.header = header;
        this.exportDto = exportDto;
        this.timeout = timeout;
    }
}
