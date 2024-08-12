export class ReportModel {
    reportId: number;
    name: string;
    pathFile: string;
    extension: string;
    parameter: string;

    clone(c: ReportModel): ReportModel {
        const clone: ReportModel = new ReportModel();
        clone.reportId = c.reportId;
        clone.name = c.name;
        clone.pathFile = c.pathFile;
        clone.extension = c.extension;
        clone.parameter = c.parameter;
        return clone;
    }
}
