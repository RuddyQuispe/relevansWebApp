import { RequestHeaderModel } from '@app/model/requestHeader.model';
import { JobModel } from '@app/model/job/job.model';

export class JobModelRequestSingle {
    public header: RequestHeaderModel;
    public job: JobModel;

    constructor(header: RequestHeaderModel, jobDto: JobModel) {
        this.header = header;
        this.job = jobDto;
    }
}
