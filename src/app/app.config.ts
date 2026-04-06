import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';



import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { SelectivePreloadingStrategy } from './selective-preloading.strategy';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withPreloading(SelectivePreloadingStrategy)), provideHttpClient(), 
  { provide: LOCALE_ID, useValue: 'pt-BR' }, provideTranslateService({
      lang: 'pt-BR',
      fallbackLang: 'pt-BR',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      })
    })], 
  
};
