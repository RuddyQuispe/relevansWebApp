export class EmailModel {
    emailId: number;
    code: string;
    reference: string;
    title: string;
    receiver: string;
    body: string;
    fields: string;
    lastUser: string;
    lastTime: Date;

    clone(c: EmailModel): EmailModel {
        const model: EmailModel = new EmailModel();
        model.emailId = c.emailId;
        model.code = c.code;
        model.reference = c.reference;
        model.title = c.title;
        model.receiver = c.receiver;
        model.body = c.body;
        model.fields = c.fields;
        model.lastUser = c.lastUser;
        model.lastTime = c.lastTime;
        return model;
    }
}
