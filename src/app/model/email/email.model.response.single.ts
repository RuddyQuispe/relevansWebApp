import { EmailModel } from '@app/model/email/email.model';
import { ResponseHeaderModel } from '@app/model/responseHeader.model';

export class EmailModelResponseSingle {
    public header: ResponseHeaderModel;
    public email: EmailModel;
}
