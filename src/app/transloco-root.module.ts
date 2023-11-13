import { HttpClient } from '@angular/common/http';
import {
  TRANSLOCO_LOADER,
  Translation,
  TranslocoLoader,
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule,
  TranslocoService
} from '@ngneat/transloco';
import { APP_INITIALIZER, Injectable, isDevMode, NgModule } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) { }

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
    {
      // Provide the default Transloco configuration
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: [
          {
            id: 'en',
            label: 'English'
          },
          {
            id: 'tr',
            label: 'Türkçe'
          }
        ],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: true
      })
    },
    {
      // Provide the default Transloco loader
      provide: TRANSLOCO_LOADER,
      useClass: TranslocoHttpLoader
    },
    {
      // Preload the default language before the app starts to prevent empty/jumping content
      provide: APP_INITIALIZER,
      deps: [TranslocoService],
      useFactory: (translocoService: TranslocoService): any => (): Promise<Translation> => {
        const defaultLang = translocoService.getDefaultLang();
        translocoService.setActiveLang(defaultLang);
        return translocoService.load(defaultLang).toPromise();
      },
      multi: true
    }
  ]
})
export class TranslocoRootModule { }
