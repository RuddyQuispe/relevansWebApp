import { ResponseHeaderModel } from '@app/model/responseHeader.model';
import { JobModel } from '@app/model/job/job.model';


export class JobModelResponseSingle {
    public header: ResponseHeaderModel;
    public job: JobModel;
}
