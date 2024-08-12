import {EncryptService} from '@services/encrypt.service';

export class StorageUtil {
  static encryptService: EncryptService = new EncryptService();


  static set(key: string, value: any) {
    localStorage.setItem(this.encryptService.enc(key), this.encryptService.enc(value.toString()));
  }

  static get(key: string) {
    const val = localStorage.getItem(this.encryptService.enc(key));
    if (!val) {
      return val;
    }
    return this.encryptService.des(val);
  }

  static remove(key: string) {
    localStorage.removeItem(this.encryptService.enc(key));
  }

  static sha(value: string) {
    return this.encryptService.sha(value);
  }
}
