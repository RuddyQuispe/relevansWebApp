import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();
}

if (window && !environment.printLog) {
    // tslint:disable-next-line:only-arrow-functions
    window.console.log = function() {
    };
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
