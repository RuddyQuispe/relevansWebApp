import {AuthService} from '@services/auth.service';
import {RequestHeaderModel} from '@app/model/requestHeader.model';

export class BaseModel {

  protected auth: AuthService;

  constructor(auth: AuthService) {
    this.auth = auth;
  }

  public getHeader(): RequestHeaderModel {
    const header = new RequestHeaderModel(this.auth.getUser());
    return header;
  }
}
