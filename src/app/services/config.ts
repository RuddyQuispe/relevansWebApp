import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {MESSAGE} from '@config/config';
import {IConfig} from '@app/model/util';

@Injectable()
export class Config {
    static settings: IConfig;

    constructor(private http: HttpClient) {
    }

    load() {
        const jsonFile = `assets/config/config.${environment.name}.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response: IConfig) => {
                Config.settings = (response as IConfig);
                resolve();
            }).catch((response: any) => {
                reject(`${MESSAGE.ERROR_FILE_CONFIG} '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }
}
