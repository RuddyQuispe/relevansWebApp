import { RequestHeaderModel } from '@app/model/requestHeader.model';
import { EmailModel } from '@app/model/email/email.model';

export class EmailModelRequestSingle {
    public header: RequestHeaderModel;
    public email: EmailModel;

    constructor(header: RequestHeaderModel, email: EmailModel) {
        this.header = header;
        this.email = email;
    }
}

