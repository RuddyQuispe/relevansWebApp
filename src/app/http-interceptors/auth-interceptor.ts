import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {AuthService} from '@services/auth.service';
import {Observable} from 'rxjs';
import {URL_SECURITY} from '@config/config';
import {Config} from '@services/config';
import {map} from 'rxjs/operators';
import {S1Model, S2Model} from '@app/model/security';
import {StorageUtil} from '@app/model/util';
import {MensajeService} from '@app/error/mensaje.service';
import {environment} from '../../environments/environment';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private message: MensajeService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let hasTok = false;
    let authToken;
    if (this.authService.currentUserValue) {
      authToken = this.authService.getAuthorizationToken();
      req = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${authToken}`)
          }
      );
      console.log(req);
      hasTok = true;
    }

    let tk = '';

    // @ts-ignore
    if (environment.NG_SEC) {
      if (req.body != null && req.body !== '') {
        const s1 = new S1Model();
        let newUrl = '';
        if (hasTok) {
          newUrl = Config.settings.path.url_root_admin + URL_SECURITY.CIFWT;
          tk = authToken;
          s1.dir2 = StorageUtil.encryptService.enc2(window.location.href.toString(), tk);
        } else {
          newUrl = Config.settings.path.url_root_admin + URL_SECURITY.CIFNT;
          tk = StorageUtil.encryptService.sha(new Date().getTime().toString());
          s1.tk = tk;
        }
        s1.payload = StorageUtil.encryptService.enc2(JSON.stringify(req.body), tk);
        s1.dir = StorageUtil.encryptService.enc2(req.url, tk);
        req = req.clone({url: newUrl, body: s1});
      }
    }

    return next.handle(req).pipe(
      map(evt => {
        if (evt instanceof HttpResponse) {
          // UPDATE TOK
          const neoTk = evt.headers.get('TokenR');
          if (neoTk != null) {
            this.authService.updateToken(neoTk);
          }

          // @ts-ignore
          if (environment.NG_SEC) {
            let s2 = new S2Model();
            s2 = evt.body;

            if (s2.codReturn != null) {
              if (s2.codReturn === '0') {
                const des = JSON.parse((StorageUtil.encryptService.des2(s2.payload.toString(), tk)));
                console.log('DECRIPT::', des);
                if (des.header.codReturn > 0) {
                  return evt = evt.clone({
                      body: ''
                    }
                  );
                }
                return evt = evt.clone({
                    body: des
                  }
                );
              } else {
                this.message.showError(s2.txtReturn);
              }
            }
          }
        }
        return evt;
      })
    );
  }
}
