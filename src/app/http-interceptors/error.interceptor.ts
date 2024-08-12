import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError, TimeoutError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from '@services/auth.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {MESSAGE} from '@config/config';
import {MensajeService} from '@app/error/mensaje.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private message: MensajeService,
        private router: Router,
        private translate: TranslateService
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let errorMessage = '';
        let dialogMessage = '';
        const errores: string[] = ['501', '502', '509'];
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log('INTERCEPTOR_ERROR', error);
                if (error.error instanceof TimeoutError) {
                    errorMessage = MESSAGE.TIMEOUT;
                } else if (error.status === 400 && error.error != null) {
                    console.log(error.error.header);
                    if (errores.includes(error.error.toString())) {
                        dialogMessage = this.translate.instant(error.error.toString());
                    } else {
                        errorMessage = this.translate.instant(error.error.mensaje);
                    }
                } else {
                    switch (error.status) {
                        case 500: {
                            errorMessage = error.error.message;
                            break;
                        }
                        case 401: {
                            errorMessage = this.translate.instant('error_session_time');
                            // this.router.navigate(['/login']);
                            break;
                        }
                        case 403: {
                            this.router.navigate(['/accessdenied']);
                            break;
                        }
                        case 404: {
                            errorMessage = error.error.message;
                            break;
                        }
                        case 407: {
                            errorMessage = this.translate.instant('error_login');
                            this.router.navigate(['/login']);
                            break;
                        }
                        default: {
                            if (!navigator.onLine) {
                                errorMessage = this.translate.instant('error_sci');
                            } else {
                                errorMessage = this.translate.instant('error');
                            }
                        }
                    }
                }
                if (errorMessage) {
                    this.message.showError(errorMessage);
                    return throwError(errorMessage);
                }
                if (dialogMessage) {
                    this.message.showError(errorMessage);
                    return throwError(dialogMessage);
                }
                return throwError(error);
            }));
    }
}
