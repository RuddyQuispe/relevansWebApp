export class JobModel {
    jobId: number;
    code: string;
    reference: string;
    schedule: string;
    concurrent: boolean;
    maxThreads: number;
    maxRetry: number;
    enabled: boolean;
    lastUser: string;
    lastTime: Date;
    url: string;

    clone(c: JobModel): JobModel {
        const model: JobModel = new JobModel();
        model.jobId = c.jobId;
        model.code = c.code;
        model.reference = c.reference;
        model.schedule = c.schedule;
        model.concurrent = c.concurrent;
        model.maxThreads = c.maxThreads;
        model.maxRetry = c.maxRetry;
        model.enabled = c.enabled;
        model.lastUser = c.lastUser;
        model.lastTime = c.lastTime;
        model.url = c.url;
        return model;
    }

}
