import { ResponseHeaderModel } from '@app/model/responseHeader.model';
import { JobModel } from '@app/model/job/job.model';


export class JobModelResponseList {
    public header: ResponseHeaderModel;
    public jobs: Array<JobModel>;
}
