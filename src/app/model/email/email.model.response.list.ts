import { EmailModel } from '@app/model/email/email.model';
import { ResponseHeaderModel } from '@app/model/responseHeader.model';

export class EmailModelResponseList {
    public header: ResponseHeaderModel;
    public emails: Array<EmailModel>;
}
